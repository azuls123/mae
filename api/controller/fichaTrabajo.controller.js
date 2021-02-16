'use strict'

const FichaTrabajo = require('../model/fichaTrabajo.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewFichaTrabajo = new FichaTrabajo();
        
        NewFichaTrabajo.Tipo            = Params.Tipo;
        NewFichaTrabajo.Descripcion     = Params.Descripcion;
        // NewTrabajo.FichaTecnica    = Params.FichaTecnica;

        if (request.usuario && request.usuario.id) {
            NewFichaTrabajo.Created.By = request.usuario.id;
        }
        NewFichaTrabajo.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', FichaTrabajo: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        let Query   = FichaTrabajo.find();

        if (request.body) Query = FichaTrabajo.find(request.body);

        Query.populate({
            path: 'Created.By Updated.By FichaTecnica Trabajo',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', FichaTrabajos: Response});
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
    