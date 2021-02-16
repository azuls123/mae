export class OrdenCombustibleModel {
    constructor (
        public _id          : string,
        public Numero       : number,
        public Fecha        : string,
        public Responsable  : string,
        public Vehiculo     : string,
        public Motivo       : string,
        public Aceite       : string,
        public Cantidad     : number,
        public Combustible  : string,
        public Valor        : number,
        public IVA          : string,

    ) {
        
    }
}