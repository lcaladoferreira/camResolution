const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

app.get ("/login", function (req, res){

	res.render("login")
})

app.post ("/add", function (req, res){

	res.render("Dados enviados!")
})

app.listen (8001, function(){

console.log("Servidor rodando na url http://localhost:8001")
})