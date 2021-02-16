export class EmpleadoModel {
    constructor (
        public _id         : string,
        public Ci          : string,
        public Nombres     : string,
        public Apellidos   : string,
        public Area        : string,
        public Cargo       : string,
        public Telefono    : string,
        public Activo      : boolean,
    ) {
        this.Activo = true;
    }
}