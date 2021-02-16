'use strict'

const Mongoose = require('mongoose');
const Routes = require('./routes');
const Port = 3801;

Mongoose.Promise = global.Promise;
Mongoose.connect('mongodb://localhost:27017/mantenimientos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log('Conexion a la Base de Datos exitosa');
        // servidor
        Routes.listen(Port, () => {
            console.log('Servidor en Linea en el puerto: ' + Port)
        });
    })
    .catch(err => console.error(err));