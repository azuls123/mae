export class TrabajoOrdenModel {
    constructor(
        public _id         : string,
        public Trabajo     : string,
        public Detalles    : string,
        public Orden       : string,
        public Cantidad    : number
    ) {
        
    }
}