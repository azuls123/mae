'use strict'

const OrdenCombustible = require('../model/ordenCombustible.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewOrdenCombustible = new OrdenCombustible();
        
        NewOrdenCombustible.Fecha       =  Params.Fecha      ;
        NewOrdenCombustible.Numero      =  Params.Numero     ;
        NewOrdenCombustible.Responsable =  Params.Responsable;
        NewOrdenCombustible.Vehiculo    =  Params.Vehiculo   ;
        NewOrdenCombustible.Motivo      =  Params.Motivo     ;
        NewOrdenCombustible.Aceite      =  Params.Aceite     ;
        NewOrdenCombustible.Cantidad    =  Params.Cantidad   ;
        NewOrdenCombustible.Combustible =  Params.Combustible;
        NewOrdenCombustible.Valor       =  Params.Valor      ;
        NewOrdenCombustible.IVA         =  Params.IVA        ;

        if (request.usuario && request.usuario.id) {
            NewOrdenCombustible.Created.By = request.usuario.id;
        }

        NewOrdenCombustible.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', ErrorSave});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', OrdenCombustible: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        // const Cargo = request.params.Cargo;
        let Query = OrdenCombustible.find();

        if (request.body) Query = OrdenCombustible.find(request.body);

        Query.populate({
            path: 'Created.By Updated.By Vehiculo Responsable IVA',
            populate: {
                path: 'Empleado'
            }

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', OrdenCombustibles: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        OrdenCombustible.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', OrdenCombustible: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
