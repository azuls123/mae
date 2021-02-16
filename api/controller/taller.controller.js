'use strict'

const Taller = require('../model/taller.model');
const Moment = require('moment');

    function Crear(request, response) {
        const Params = request.body;
        const NewTaller = new Taller();
        NewTaller.RUC = Params.RUC;
        NewTaller.Nombre = Params.Nombre;
        NewTaller.Direccion = Params.Direccion;
        if (request.usuario && request.usuario.id) {
            NewTaller.Created.By = request.usuario.id;
        }
        NewTaller.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Taller: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }
    function Leer(request, response) {
        Taller.find().populate(
            {
                path: 'Created.By Updated.By',
                populate: {
                    path: 'Empleado'
                }
            }
        ).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Talleres: Response});
        })
    }
    
    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        Taller.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Taller: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}