'use strict'

const Vehiculo = require('../model/vehiculo.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewVehiculo = new Vehiculo();
        
        NewVehiculo.Caracteristicas     = Params.Caracteristicas;
        NewVehiculo.Marca               = Params.Marca;
        NewVehiculo.Modelo              = Params.Modelo;
        NewVehiculo.Anio                = Params.Anio;
        NewVehiculo.Clase               = Params.Clase;
        NewVehiculo.Llantas             = Params.Llantas;
        NewVehiculo.Placa               = Params.Placa;
        NewVehiculo.Matricula           = Params.Matricula;
        NewVehiculo.Recorrido           = Params.Recorrido;
        NewVehiculo.Color               = Params.Color;
        NewVehiculo.Costo               = Params.Costo;
        NewVehiculo.Combustible               = Params.Combustible;
        NewVehiculo.Responsable               = Params.Responsable;
        NewVehiculo.Activo              = Params.Activo;

        if (request.usuario && request.usuario.id) {
            NewVehiculo.Created.By = request.usuario.id;
        }
        NewVehiculo.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', ErrorSave});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Vehiculo: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        const Tipo = request.params.Tipo;
        let Query   = Vehiculo.find({Tipo});

        if (!Tipo) Query = Vehiculo.find();

        Query.populate({
            path: 'Created.By Updated.By Responsable',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Vehiculos: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        Vehiculo.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Vehiculo: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    