'use strict'

const Express = require('express');
const Controller = require('../controller/trabajoOrden.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/crear',Authenticate.ensureAuth , Controller.Crear);
    Api.post('/leer',Authenticate.ensureAuth , Controller.Leer);
    Api.put('/editar',Authenticate.ensureAuth , Controller.Editar);

module.exports = Api;
