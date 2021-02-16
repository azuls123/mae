'use strict'

const FichaTecnica = require('../model/fichaTecnica.model');
const Moment = require('moment');

// funciones
    // devolver Numero actual de Ficha Tecnica
    async function NumeroActual() {
        let fichas = await FichaTecnica.find().exec();
        let Numero = 0;
        if (fichas && fichas.length <=0) {
            Numero = 1;
        } else {
            let Unico = false;
            while (Unico == false) {
                Numero ++;
                if (!fichas.find(ficha => ficha.Numero == Numero)) Unico = true;
            }
        }
        return Numero;
    }
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewFichaTecnica = new FichaTecnica();
        NumeroActual().then((Numero) => {
            Params.Numero = Numero;
            NewFichaTecnica.Kilometraje     = Params.Kilometraje;
            NewFichaTecnica.FechaAnterior   = Params.FechaAnterior;
            NewFichaTecnica.Recorrido       = Params.Recorrido;
            NewFichaTecnica.Empleado        = Params.Empleado;
            if (request.usuario && request.usuario.id) {
                NewFichaTecnica.Created.By = request.usuario.id;
            }
            if (Params.Solicitud && Params.Solicitud.Fecha && Params.Solicitud.Hora) {
                NewFichaTecnica.Solicitud = {
                    Fecha: Params.Solicitud.Fecha,
                    Hora : Params.Solicitud.Hora
                }
            }
            if (Params.IngresoTaller && Params.IngresoTaller.Fecha && Params.IngresoTaller.Hora) {
                NewFichaTecnica.IngresoTaller = {
                    Fecha : Params.IngresoTaller.Fecha,
                    Hora: Params.IngresoTaller.Hora
                }
            }
    
            NewFichaTecnica.save((ErrorSave, Stored) => {
                if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', Stored});
                if (Stored) return response.status(201).send({Message: 'registro Guardado', FichaTecnica: Stored});
                return response.status(404).send({Message: 'No se Guardo el Registro'});
            })
        })
    }

    function Leer(request, response) {
        const Cargo = request.params.Cargo;
        let Query   = FichaTecnica.find({Cargo});

        if (!Cargo) Query = FichaTecnica.find();

        Query.populate({
            path: 'Created.By Updated.By Recorrido Empleado',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', FichaTecnicas: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        FichaTecnica.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', FichaTecnica: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    