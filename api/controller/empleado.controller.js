'use strict'

const Empleado = require('../model/empleado.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewEmpleado = new Empleado();
        
        NewEmpleado.Ci          = Params.Ci;
        NewEmpleado.Nombres     = Params.Nombres;
        NewEmpleado.Apellidos   = Params.Apellidos;
        NewEmpleado.Area        = Params.Area;
        NewEmpleado.Cargo       = Params.Cargo;
        NewEmpleado.Telefono    = Params.Telefono;

        if (request.usuario && request.usuario.id) {
            NewEmpleado.Created.By = request.usuario.id;
        }

        NewEmpleado.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', ErrorSave});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Empleado: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        const Cargo = request.params.Cargo;
        let Query   = Empleado.find({Cargo});

        if (!Cargo) Query = Empleado.find();

        Query.populate({
            path: 'Created.By Updated.By',
            populate: {
                path: 'Empleado'
            }

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Empleados: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        Empleado.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Empleado: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    