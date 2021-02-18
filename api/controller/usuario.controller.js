'use strict'

const Usuario = require('../model/usuario.model');
const Moment = require('moment');
const Bcrypt = require('bcrypt-nodejs');
const JWT = require('../services/jwt');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewUsuario = new Usuario();
        
        NewUsuario.Correo            = Params.Correo;
        NewUsuario.Empleado     = Params.Empleado;
        if (request.usuario && request.usuario.id) {
            NewUsuario.Created.By = request.usuario.id;
        }
        Bcrypt.hash(Params.Contrase, null, null, (error, CryptedPassword) => {
             if (error) return response.status(500).send({Message: 'Error al encriptar la contraseña'});
             if (CryptedPassword) NewUsuario.Contrase = CryptedPassword;
            NewUsuario.save((ErrorSave, Stored) => {
                if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
                if (Stored) return response.status(201).send({Message: 'registro Guardado', Usuario: Stored});
                return response.status(404).send({Message: 'No se Guardo el Registro'});
            })

        })
        // NewUsuario.Contrase       = Params.Contrase;
    }

    function Leer(request, response) {
        const Tipo = request.params.Tipo;
        let Query   = Usuario.find({Tipo});

        if (!Tipo) Query = Usuario.find();

        Query.populate({
            path: 'Created.By Updated.By Empleado',
            populate: {
                path: 'Empleado'
            }

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Usuarios: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        Usuario.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Usuario: Updated});
        })
    }

    function UpdatePassword(request,response) {
        const Update = request.body;
        const Id = request.params.id;
        if (Update.Contrase == Update.Confirmar) {
            Bcrypt.hash(Update.Contrase, null, null, (error, CryptedPassword) => {
                if (error) return response.status(500).send({Message: 'Error al encriptar la contraseña'});
                if (CryptedPassword) Update.Contrase = CryptedPassword;
                Usuario.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
                    if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
                    if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
                    return response.status(200).send({Message: 'Registro Editado', Usuario: Updated});
                })
           })
        } else {
            return response.status(403).send({Message: 'Las Contraseñas no coinciden'})
        }
    }
    function UpdateMyPassword(request, response) {
        const Update = request.body;
        if (Update.Anterior && Update.Anterior != '' && Update.Contrase && Update.Contrase != '' && Update.Contrase == Update.Confirmar) {
    
            Usuario.findById(Update._id).exec((error, usuario) => {
                if (error) return response.status(500).send({ Message: 'No se Encontró el Usuario' });
                Bcrypt.compare(Update.Anterior, usuario.Contrase, (ErrorContrase, check) => {
                    if (ErrorContrase) return response.status(500).send({ Message: 'La contraseña Anterior no Coincide' });
                    Bcrypt.hash(Update.Contrase, null, null, (error, CryptedPassword) => {
                        if (error) return response.status(500).send({ Message: 'Error al encriptar la contraseña' });
                        if (CryptedPassword) usuario.Contrase = CryptedPassword;
                        Usuario.findByIdAndUpdate(usuario._id, usuario, { new: true }, (Error, Updated) => {
                            if (Error) return response.status(500).send({ Message: 'Error al Cambiar la Contraseña', Error });
                            if (!Updated || Updated == null) return response.status(404).send({ Message: 'No se ha podido Cambiar la Contraseña' })
                            return response.status(200).send({ Message: 'Cambio de contraseña Exitoso', Usuario: Updated });
                        })
                    })
                })
            })
    
        } else {
            return response.status(404).send({ Message: 'Faltan Campos!!' });
        }
    }

    function Login(request, response) {
        const Params = request.body;
        const Correo = Params.Correo;
        const Contrase = Params.Contrase;
        // console.log(Params);
        Usuario.findOne({Correo:Correo, Activo: true}).populate({
            path: 'Empleado Created.By',
            populate: {
                path: 'Empleado'
            }
        }).exec((Error, usuario) => {
            // console.log(usuario);
            if (Error) return response.status(500).send({ Title: 'Alerta', Message: 'No se puede Iniciar el Logueo', Error });
            // console.log(usuario);
            if (usuario) {
                Bcrypt.compare(Contrase, usuario.Contrase, (ErrorPassword, check) => {
                    if (ErrorPassword) return response.status(500).send({ Title: 'Alerta', Message: 'No se han podido comprarar las Contraseñas!!', ErrorPassword });
                    if (check) {
                        usuario.Password = 'Private';
                        usuario.Expiration = Moment().add(15, 'days').unix();
                        return response.status(200).send({
                            Token: JWT.createToken(usuario),
                            Usuario: usuario,
                            Message: 'Logueo correcto',
                            Title: 'Exito'
                        })
                    } else {
                        return response.status(401).send({  Title: 'Error', Message: 'La Contraseña es Incorrecta' });
                    }
                });
            } else {
                return response.status(404).send({  Title: 'Error', Message: 'Correo Incorrecto o la Cuenta no Existe' });
            }
        });
        
    }
module.exports = {
    Crear,
    Leer,
    Editar,
    Login,
    UpdatePassword,
    UpdateMyPassword
}
    