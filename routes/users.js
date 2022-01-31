const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const db = require("../models/index");
const nodemailer = require("nodemailer");

const router = express.Router(); //api/usuários

// configuração inicial de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD
  }
});

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: new PasswordComplexity().required()
  };

  return Joi.validate(user, schema);
}

// Registro de usuário
router.post("/register", async (req, res) => {
  try {
    await validateUser(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }

  const userFound = await db.User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (userFound) return res.status(400).send("User already registered");

  // criar novo usuário
  let user = await db.User.build({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  // Hash senha
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(_.pick(user, ["username", "email"]));
});

// ir para página de reset de senha
router.post("/reset_password/:email", async (req, res) => {
  let user;
  try {
    user = await db.User.findOne({
      where: { email: req.params.email }
    });
  } catch (err) {
    return res.status(404).send("Error reading from database");
  }
  if (!user) {
    return res.status(404).send("Email never registered.");
  }
  // Gerador de URL de uso único com jwt token
  const secret = `${user.password}-${user.createdAt}`;
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: 3600 // expira em 1 hora
  });
  const url = `localhost:${process.env.PORT ||
    3000}/users/reset_password_received/${user.id}/${token}`;

  const emailTemplate = {
    subject: "Password Reset Node Auth Application",
    html: `
      <p>Hello ${user.username},</p>
      <p>You recently requested to reset your password.</p>
      <p>Click the following link to finish resetting your password.</p>
      <a href=${url}>${url}</a>`,
    from: process.env.EMAIL_LOGIN,
    to: user.email
  };

  const sendEmail = async () => {
    try {
      const info = await transporter.sendMail(emailTemplate);
      console.log("Email sent", info.response);
      return res.status(200).send("Email sent");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error sending email");
    }
  };

  sendEmail();
});
// método post para verificar o rest da senha
router.post("/receive_new_password/:id/:token", async (req, res) => {
  // Primeiro objeto de solicitação de análise
   // Obtém id e token dentro dos parâmetros e nova senha no corpo
  const { id, token } = req.params;
  const { password } = req.body;
  // Validar nova senha
  try {
    await Joi.validate(
      { password },
      {
        password: new PasswordComplexity().required()
      }
    );
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }
  // obter usuário do banco de dados com id
  let user;
  try {
    user = await db.User.findOne({
      where: { id }
    });
  } catch (err) {
    return res.status(404).send("Error reading database");
  }
  if (!user) return res.status(404).send("No user with that id");
  // Gerar token secreto
  const secret = `${user.password}-${user.createdAt}`;
  // Verifica se o token é válido
  const payload = jwt.decode(token, secret);
  if (!payload) {
    return res.status(404).send("Invalid id or token");
  }
  if (payload.id != id) {
    return res.status(404).send("Invalid id or token");
  }
  // Hash nova senha e armazene no banco de dados
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user = await user.save();
  return res.status(200).send("Password Reset Success!");
});

module.exports = router;
