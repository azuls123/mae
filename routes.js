'use strict'

const Express = require('express');
const BodyParser = require('body-parser');
const App = Express();
const path = require('path');

// Cargar Rutas

const RoutesEmpleado        = require('./api/routes/empleado.routes');
const RoutesEstadoRecepcion = require('./api/routes/estadoRecepcion.routes');
const RoutesFichaTecnica    = require('./api/routes/fichaTecnica.routes');
const RoutesOrdenTrabajo    = require('./api/routes/ordenTrabajo.routes');
const RoutesOrdenCombustible= require('./api/routes/ordenCombustible.routes');
const RoutesRecorrido       = require('./api/routes/recorrido.routes');
const RoutesSalvoconducto   = require('./api/routes/salvoconducto.routes');
const RoutesTrabajo         = require('./api/routes/trabajo.routes');
const RoutesUsuario         = require('./api/routes/usuario.routes');
const RoutesVehiculo        = require('./api/routes/vehiculo.routes');
const RoutesTaller          = require('./api/routes/taller.routes');
const RoutesTrabajoOrden    = require('./api/routes/trabajoOrden.routes');
const RoutesIva             = require('./api/routes/iva.routes');
// middlewares
    // body parser starts
    App.use(BodyParser.urlencoded({extended: false}));
    App.use(BodyParser.json());
    // body parser ends

// configuraciones
    // Configuracion para intercambio de recursos de origenes cruzados CORS //
    App.use((req, res, next) => {
        // Configuracion de Control de Acceso a cualquiera //
        res.header('Access-Control-Allow-Origin', '*');
        // Configuracion de control de Cabeceras, definicion de tipos //
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        // Configuracion de control de Metodos accesibles (Api-Rest[GET, POST, PUT, DELETE, OPTIONS]) //
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        // Acceso final a los metodos de Api Rest por medio de las cabeceras //
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
    
// Rutas Externa Externas [frontend]
App.use('/', Express.static('client', {redirect: false}));

// Rutas Internas
App.use('/empleado', RoutesEmpleado);
App.use('/estado-recepcion', RoutesEstadoRecepcion);
App.use('/ficha-tecnica', RoutesFichaTecnica);
App.use('/orden-trabajo', RoutesOrdenTrabajo);
App.use('/orden-combustible', RoutesOrdenCombustible);
App.use('/recorrido', RoutesRecorrido);
App.use('/salvoconducto', RoutesSalvoconducto);
App.use('/trabajo', RoutesTrabajo);
App.use('/usuario', RoutesUsuario);
App.use('/vehiculo', RoutesVehiculo);
App.use('/taller', RoutesTaller);
App.use('/trabajo-orden', RoutesTrabajoOrden);
App.use('/iva', RoutesIva);

// Ruta de Pruebas
App.get('/test', (req, res) => {
    res.status(200).send({
        message: 'Servidor corriendo Correctamente!',
        check: true
    })
});

App.get('*', function(req, res, next) {
    res.sendFile(path.resolve('client/index.html'));
})



// salida
module.exports = App;