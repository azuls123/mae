export class SalvoConductoModel {
    constructor (
        public _id         : string,
        public Numero      : number,
        public Lugar       : {
            Origen: string,
            Destino: string
        },
        public Fecha       : {
            Salida: string,
            Estimada: string,
            Regreso: string
        },
        public Emision     : {
            Lugar: string,
            Fecha: string
        },
        public Conductor   : string,
        public Recorrido   : number,
        public KmInicial   : number,
        public Motivo      : string,
        public Vehiculo    : string,
        public Estado      : string,
    ) {
    }
}