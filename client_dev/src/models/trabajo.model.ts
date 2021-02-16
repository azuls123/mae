export class TrabajoModel {
    constructor (
        public _id           : string,
        public Tipo          : string,
        public Descripcion   : string,
        public Activo        : boolean
    ) {
        this.Activo = true;
    }
}