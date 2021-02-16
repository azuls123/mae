'use strict'

const Recorrido = require('../model/recorrido.model');
const Moment = require('moment');

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewRecorrido = new Recorrido();
        
        // NewRecorrido.Km_Inicial = Params.Km_Inicial;
        NewRecorrido.Km_Final   = Params.Km_Final;

        NewRecorrido.save((ErrorSave, Stored) => {
            if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
            if (Stored) return response.status(201).send({Message: 'registro Guardado', Recorrido: Stored});
            return response.status(404).send({Message: 'No se Guardo el Registro'});
        })
    }

    function Leer(request, response) {
        const Tipo = request.params.Tipo;
        let Query   = Recorrido.find({Tipo});

        if (!Cargo) Query = Recorrido.find();

        Query.populate({
            path: 'Created.By Updated.By FichaTecnica',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Recorrido: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        Recorrido.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Recorrido: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    