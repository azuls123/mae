'use strict'

const Iva = require('../model/iva.model');
const Moment = require('moment');

// funciones
    // Setear Iva
    function Crear(request, response) {
        const Params = request.body;
        const NewIva = new Iva();
        // console.log(Params);
        NewIva.Fecha      = Params.Fecha      ;
        NewIva.Valor      = Params.Valor      ;

        if (request.usuario && request.usuario.id) {
            NewIva.Created.By = request.usuario.id;
        }

        NewIva.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', ErrorSave});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Iva: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })

    }
    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        Iva.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Iva: Updated});
        })
    }
    function Leer(request, response) {
        let Query = Iva.find();
        if (request.body) Query = Iva.find(request.body);
        Query.populate({
            path: 'Created.By Updated.By'
        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Devolver la lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Pudo encontrar la lista'});
            return response.status(200).send({Message: 'Lista cargada correctamente!', Ivas: Response});
        })
    }
    function IvaActual(request, response) {
        Iva.find().exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Devolver la lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Pudo encontrar la lista'});
            Response.sort(function (a,b) {
                const afterDate = new Date(a.Fecha);
                const beforeDate = new Date(b.Fecha);
                
                if (afterDate > beforeDate) return -1;
                if (afterDate < beforeDate) return 1;
                return 0;
            })
            return response.status(200).send({Message: 'Lista cargada correctamente!', Iva: Response[0]});
        })
    }

module.exports = {
    Crear,
    Editar,
    Leer,
    IvaActual
}