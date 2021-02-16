export class OrdenTrabajoModel {
    constructor (
        public _id              : string,
        public Vehiculo         : string,
        public Numero           : number,
        public Solicitante      : string,
        public Taller           : string,
    ) {
    }
}