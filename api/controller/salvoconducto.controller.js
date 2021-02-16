'use strict'

const Salvoconducto = require('../model/salvoconducto.model');
const Moment = require('moment');

async function getNumberOfSalvo() {
    let temp = await Salvoconducto.find().exec();
    let Number = 0;
    if (!temp || temp.length <= 0) {
        Number = 1;
    } else {
        let Unique = false;
        while (Unique == false) {
            Number ++;
            if (!temp.find( Salvo => Salvo.Numero == Number)) {
                Unique = true;
            }
        }
    }
    return Number
}

// funciones
    // Crear
    function Crear(request, response) {
        const Params = request.body;
        const NewSalvoconducto = new Salvoconducto();
        getNumberOfSalvo().then((Numero) => {
            NewSalvoconducto.Numero = Numero;
            NewSalvoconducto.Conductor      = Params.Conductor;
            NewSalvoconducto.Motivo         = Params.Motivo;
            NewSalvoconducto.Recorrido      = Params.Recorrido;
            NewSalvoconducto.Estado       = Params.Estado;
            NewSalvoconducto.KmInicial       = Params.KmInicial;
            NewSalvoconducto.Vehiculo       = Params.Vehiculo;

            if (request.usuario && request.usuario.id) {
                NewSalvoconducto.Created.By = request.usuario.id;
            }
            if (Params.Lugar && Params.Lugar.Origen && Params.Lugar.Destino) {
                NewSalvoconducto.Lugar = {
                    Origen  : Params.Lugar.Origen,
                    Destino : Params.Lugar.Destino
                }
            }
            if (Params.Fecha && Params.Fecha.Salida && Params.Fecha.Estimada) {
                NewSalvoconducto.Fecha = {
                    Salida  : Params.Fecha.Salida,
                    Estimada  : Params.Fecha.Estimada
                }
            }
            if (Params.Emision && Params.Emision.Fecha) {
                NewSalvoconducto.Emision = {
                    Lugar : Params.Emision.Lugar,
                    Fecha : Params.Emision.Fecha
                }
            }
    
            NewSalvoconducto.save((ErrorSave, Stored) => {
                if (ErrorSave) return response.status(500).send({Message: 'Error al Guardar el Registro', ErrorSave});
                if (Stored) return response.status(201).send({Message: 'registro Guardado', Salvoconducto: Stored});
                return response.status(404).send({Message: 'No se Guardo el Registro'});
            })
        })
    }

    function Leer(request, response) {
        let Query   = Salvoconducto.find();
        // console.log(request.body);
        if (request.body) Query = Salvoconducto.find(request.body);

        Query.populate({
            path: 'Created.By Updated.By Conductor Vehiculo',

        }).exec((Error, Response) => {
            if (Error) return response.status(500).send({Message: 'Error al Obtener la Lista', Error});
            if (!Response) return response.status(404).send({Message: 'No se Encontro la Tabla'});
            return response.status(200).send({Message: 'Lista Encontrada', Salvoconductos: Response});
        })
    }

    function Editar(request, response) {
        const Id = request.params.id;
        request.body.Updated.By = request.usuario.id;
        request.body.Updated.At = Moment().unix();
        const Update = request.body;
        
        Salvoconducto.findByIdAndUpdate(Id, Update, {new: true}, (Error, Updated) => {
            if (Error) return response.status(500).send({Message: 'Error al Editar el Registro', Error});
            if (!Updated || Updated == null) return response.status(404).send({Message: 'No se ha editado el Registro'})
            return response.status(200).send({Message: 'Registro Editado', Salvoconducto: Updated});
        })
    }

module.exports = {
    Crear,
    Leer,
    Editar,
}
    