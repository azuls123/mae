export class VehiculoModel {
    constructor (
        public _id              : string,
        public Caracteristicas  : string,
        public Marca            : string,
        public Modelo           : string,
        public Anio             : string,
        public Clase            : string,
        public Llantas          : string,
        public Placa            : string,
        public Color            : string,
        public Costo            : number,
        public Matricula        : string,
        public Recorrido        : number,
        public Combustible      : string,
        public Responsable      : string,
        public Activo           : boolean
    ) {
        this.Activo = true;
    }
}