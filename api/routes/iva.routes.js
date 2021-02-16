'use strict'

const Express = require('express');
const Controller = require('../controller/iva.controller');
const Api = Express.Router();
const Authenticate = require('../middleware/authenticate');

// rutas
    Api.post('/crear',Authenticate.ensureAuth , Controller.Crear);
    Api.post('/leer',Authenticate.ensureAuth , Controller.Leer);
    Api.get('/actual',Authenticate.ensureAuth , Controller.IvaActual);
    Api.put('/editar/:id',Authenticate.ensureAuth , Controller.Editar);

module.exports = Api;
