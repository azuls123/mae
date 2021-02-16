'use strict'

const JWT = require('jwt-simple');
const Moment = require('moment');
const Key = 'secure_key_MA';

exports.createToken = function (usuario) {
    const Role = usuario.Empleado.Cargo;
    const Empleado = usuario.Empleado;
    const Payload = {
        id          : usuario._id,
        Ci          : usuario.Ci,
        Correo      : usuario.Correo,
        Nombres     : Empleado.Nombres,
        Apellidos   : Empleado.Apellidos,
        Cargo       : Role,
        Area        : Empleado.Area,
        At          : Moment().unix(),
        Expiration  : Moment().add(15, 'days').unix()
    }
    return JWT.encode(Payload, Key);
}