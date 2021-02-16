'use strict'

const Express = require('express');
const Controller = require('../controller/vehiculo.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/crear',Authenticate.ensureAuth , Controller.Crear);
    Api.get('/leer/:Tipo?',Authenticate.ensureAuth , Controller.Leer);
    Api.put('/editar/:id',Authenticate.ensureAuth , Controller.Editar);

module.exports = Api;
