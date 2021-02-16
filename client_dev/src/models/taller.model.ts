export class TallerModel {
    constructor (
        public _id          : string,
        public RUC          : string,
        public Nombre       : string,
        public Direccion    : string,
        public Activo       : boolean,
    ) {
        this.Activo = true;
    }
}