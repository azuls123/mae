'use strict'

const OrdenTrabajo = require('../model/ordenTrabajo.model');
const Moment = require('moment');

// funciones
    // devolver Numero actual de OrdenTrabajo
    async function NumeroActual() {
        let ordenTrabajos = await OrdenTrabajo.find().exec();
        let Numero = 0;
        if (ordenTrabajos && ordenTrabajos.length <=0) {
            Numero = 1;
        } else {
            let Unico = false;
            while (Unico == false) {
                Numero ++;
                if (!ordenTrabajos.find(ordenTrabajos => ordenTrabajos.Numero == Numero)) Unico = true;
            }
        }
        return Numero;
    }
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewOrdenTrabajo = new OrdenTrabajo();
        NumeroActual().then((Numero) => {
            NewOrdenTrabajo.Numero             = Numero;
            NewOrdenTrabajo.Solicitante             = Params.Solicitante;
            NewOrdenTrabajo.Taller      = Params.Taller;
            NewOrdenTrabajo.Vehiculo     = Params.Vehiculo;
    
            if (request.usuario && request.usuario.id) {
                NewOrdenTrabajo.Created.By = request.usuario.id;
            }
            NewOrdenTrabajo.save((ErrorSave, Stored) => {
                if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
                if (Stored) return response.status(201).send({Message: 'registro Guardado', OrdenTrabajo: Stored});
                return response.status(404).send({Message: 'No se Guardo el Registro'});
            })
        })
    }

    function Leer(request, response) {
        let Query = OrdenTrabajo.find();
        if (request.body) Query = OrdenTrabajo.find(request.body);
        // console.log(request.body);
        Query.populate({
            path: 'Solicitante Vehiculo Taller Created.By Updated.By',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', OrdenTrabajos: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        OrdenTrabajo.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', OrdenTrabajo: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    