Cam Resolution Checker
====================

Página simples com um Back-end pronto para receber rotas da API e um front-end com interação com usuário e utilização da câmera, identificando automaticamente as resoluções da câmera para uso com WebRTC (Desenvolvido por WebRTCHacks).

Modo de Funcionamento 
====================

O Quick Scan verifica apenas as resoluções de vídeo comuns, já o Full Scan verifica todas as resoluções 1:1, 4:3 e 16:9 entre um intervalo inserido.

O que há de novo? 
==================
* suporte das mais recentes especificações de enumeração de dispositivos e getUserMedia WebRTC
* link para [adapter-latest.js](https://webrtc.github.io/adapter/adapter-latest.js)
* adicionada varredura de proporção de aspecto 1:1 ao scanner completo
* bootstrap adicionado
* adicionou alguns links para pular mais facilmente pela mesa
* certifique-se de que funciona com Chrome, Firefox e Edge
* POST das informações para o servidor (em desenvolvimento)
* GET das informações para o cliente (em desenvolvimento)
 
Experimente a versão Beta em https://cam-resolution.vercel.app/


