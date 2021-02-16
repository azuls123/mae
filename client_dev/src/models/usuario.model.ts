export class UsuarioModel {
    constructor (
        public _id          : string,
        public Correo       : string,
        public Contrase     : string,
        public Empleado     : string,
        public Activo       : boolean,
    ) {
        this.Activo = true;
    }
}