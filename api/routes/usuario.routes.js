'use strict'

const Express = require('express');
const Controller = require('../controller/usuario.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/crear',Authenticate.ensureAuth , Controller.Crear);
    Api.post('/sudo-crear', Controller.Crear);
    Api.get('/leer/:Tipo?',Authenticate.ensureAuth , Controller.Leer);
    Api.put('/editar/:id',Authenticate.ensureAuth , Controller.Editar);
    Api.post('/login', Controller.Login);
    Api.put('/cambiar-contrase/:id', Authenticate.ensureAuth, Controller.UpdatePassword);

module.exports = Api;
