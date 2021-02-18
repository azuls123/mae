export class TrabajoOrdenModel {
    constructor(
        public _id         : string,
        public Trabajo     : string,
        public Detalles    : string,
        public Orden       : string,
        public Estado      : string,
        public Cantidad    : number,
        public Costo       : number,
        public Total       : number,
    ) {
        this.Estado = 'Pendiente/En Proceso/Completado'
    }
}