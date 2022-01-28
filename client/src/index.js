import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// Se você quiser que seu aplicativo funcione offline e carregue mais rápido, você pode alterar
// unregister() para register() abaixo. Observe que isso vem com algumas armadilhas.
// Saiba mais sobre service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
