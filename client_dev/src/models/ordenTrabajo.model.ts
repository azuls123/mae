export class OrdenTrabajoModel {
    constructor (
        public _id              : string,
        public Vehiculo         : string,
        public Numero           : number,
        public Total            : number,
        public Estado           : string,
        public Solicitante      : string,
        public Taller           : string,
        public Iva              : string
    ) {
    }
}