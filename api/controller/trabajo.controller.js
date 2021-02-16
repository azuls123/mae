'use strict'

const Trabajo = require('../model/trabajo.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewTrabajo = new Trabajo();
        
        NewTrabajo.Tipo            = Params.Tipo;
        NewTrabajo.Descripcion     = Params.Descripcion;
        NewTrabajo.Activo          = Params.Activo;
        // NewTrabajo.FichaTecnica    = Params.FichaTecnica;

        // console.log(request.usuario);

        if (request.usuario && request.usuario.id) {
            NewTrabajo.Created.By = request.usuario.id;
        }
        NewTrabajo.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Trabajo: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        let Query   = Trabajo.find();

        if (request.body) Query = Trabajo.find(request.body);

        Query.populate({
            path: 'Created.By Updated.By',
            populate: {
                path: 'Empleado'
            }

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Trabajos: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        Trabajo.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Trabajo: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    