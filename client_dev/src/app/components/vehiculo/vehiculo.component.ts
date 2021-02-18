import { Component, OnInit } from '@angular/core';
import { VehiculoModel } from '../../../models/vehiculo.model';
import { EmpleadoService } from '../../../services/empleado.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { stringify } from '@angular/compiler/src/util';
import { CurrencyPipe, DatePipe } from '@angular/common';
interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss'],
  providers: [VehiculoService, EmpleadoService, CurrencyPipe, DatePipe]
})
export class VehiculoComponent implements OnInit {

  //filtros
  public typeVehiculo: string = 'todo';
  public searchTitleVehiculo: string = 'Buscando Todo';
  public searchTextVehiculo: string;

  public paginationDataBrand = {
    id: 'Marca',
    itemsPerPage: 5,
    currentPage: 1
  }

  public paginationDataVehiculo = {
    id: 'Vehículo',
    itemsPerPage: 7,
    currentPage: 1
  }
  public bufferBrands

  public Responsable;

  public viewedVehiculo;

  public vehiculos;
  public bufferVehiculos;

  public newVehiculo: VehiculoModel 
  public Brands: string[]=[];
  
  public Empleados: any[] = [];

  public CiResponsable;

  public isUser: boolean = false;
  constructor(
    private _VehiculoService: VehiculoService,
    private _EmpleadoService: EmpleadoService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    let usuario: any = JSON.parse(localStorage.getItem('Identity'));
    if ( usuario != undefined) {
      switch (usuario.Empleado.Cargo) {
        case 'Director Provincial':
          this.isUser = true;
          break;
        case 'Secretario/a':
          this.isUser = true;
          break;
        case 'Conductor':
          this.isUser = true;
          break;
        case 'Administrador':
          this.isUser = true;
          break;
        case 'Super Usuario':
          this.isUser = true;
          break;
        default:
          this.isUser = false;
          break;
      }
    }
    this.initNewVehiculo();
    this.loadCarBrands();
    this.loadVehiculos();
    this.loadEmpleados();
   }

  loadEmpleados() {
    this._EmpleadoService.LeerCargo('Conductor').subscribe(
      response => {
        this.Empleados = response.Empleados;
      }
    )
  }

  setResponsable(str) {
    this.Responsable = null;
    let vasr = this.Empleados.find(
      empleado => 
        empleado.Ci == this.CiResponsable
    )
    // console.log(vasr);
    if (vasr) {
      this.Responsable = vasr;
      this.newVehiculo.Responsable = vasr._id;
    }
    // console.log(str);
  }

  loadCarBrands() {
    this.Brands = [
      'Chevrolet',
      'Kia',
      'Toyota',
      'Hyundai',
      'Great Wall',
      'Suzuki',
      'Chery',
      'Nissan',
      'Mazda',
      'Renault',
      'JAC',
      'Ford',
      'Hino',
      'Volkswagen',
      'Citroën',
      'Soueast',
      'Peugeot',
      'DFSK',
      'Mitsubishi',
      'Dongfeng',
      'Zotye',
      'Jeep',
      'Fiat',
      'Mercedes',
      'BMW',
      'Honda',
      'Dodge',
      'BYD',
      'Audi',
      'Škoda',
      'JMC',
      'SsangYong',
      'Lifan',
      'Volvo',
      'Jinbei',
      'Mahindra',
      'MINI',
      'Porsche',
      'Changhe',
      'Dacia',
      'Tata',
      'Land Rover',
      'Lexus',
      'Geely',
    ];
    this.Brands.sort();
    this.bufferBrands = this.Brands;
  }
  searchBrand(value) {
    this.Brands = [];
    const valueLow = value.toLowerCase().replace(/' '/g, '');
    for (const brand of this.bufferBrands) {
      const brandLow = brand.toLowerCase().replace(/' '/g, '');
      if (brandLow.indexOf(valueLow) > -1) this.Brands.push(brand);
    }
    if (this.Brands.length == 0) this.Brands = this.bufferBrands;
  }
  loadVehiculos() {
    this._VehiculoService.Leer().subscribe(
      response => {
        // console.log(response);
        this.vehiculos = response.Vehiculos;
        this.bufferVehiculos = response.Vehiculos;
      }
    )
  }
  toDelete(vehiculo) {
    vehiculo.Activo = !vehiculo.Activo;
    this._VehiculoService.Editar(vehiculo).subscribe(
      response => {
        // console.log(response);
        vehiculo = response.Vehiculo;
      }
    )
  }
  initNewVehiculo () {
    this.CiResponsable = '';
    this.Responsable = undefined;
    this.newVehiculo = {
      _id: '',
      Caracteristicas: '',
      Marca: '',
      Modelo: '',
      Anio: '',
      Clase: '',
      Llantas: '',
      Placa: '',
      Matricula: '',
      Recorrido: 0,
      Combustible: '',
      Responsable: '',
      Color: '',
      Costo: 0,
      Activo: true
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.Responsable && this.Responsable._id) {
      this.newVehiculo.Responsable = this.Responsable._id;
    }
    // console.log(this.newVehiculo);
    
    (this.newVehiculo._id !== '') ? this.onUpdate(): this.onCreate();
  }

  onUpdate() {
    this._VehiculoService.Editar(this.newVehiculo).subscribe(
      response => {
        this.loadVehiculos();
        this.initNewVehiculo();
        // console.log(response);
      },
      error => {console.error(error as any);
      }
    )
  }
  unlinkObject(Obj): any {
    const Stringed = JSON.stringify(Obj);
    const Unlinked = JSON.parse(Stringed);
    return Unlinked;
  }
  onCreate() {
    this._VehiculoService.Crear(this.newVehiculo).subscribe(
      response => {
        // console.log(response);
        this.loadVehiculos();
        this.initNewVehiculo();
      },
      error => {console.error(error as any);
      }
    )
  }

  defineVehiculo() {
    this.vehiculos = [];
    if (this.searchTextVehiculo != '' && this.searchTextVehiculo != undefined) {
      for (const vehiculo of this.bufferVehiculos) {
        const caracteristicas = vehiculo.Caracteristicas.replace('-', '').replace('/', '').toLowerCase();
        const marca = vehiculo.Marca.replace('-', '').replace('/', '').toLowerCase();
        const modelo = vehiculo.Modelo.replace('-', '').replace('/', '').toLowerCase();
        const anio = vehiculo.Anio.replace('-', '').replace('/', '').toLowerCase();
        const clase = vehiculo.Clase.replace('-', '').replace('/', '').toLowerCase();
        const llantas = vehiculo.Llantas.replace('-', '').replace('/', '').toLowerCase();
        const placa = vehiculo.Placa.replace('-', '').toLowerCase();
        const matricula = vehiculo.Matricula.replace('-', '').toLowerCase();
        const color = vehiculo.Color.replace('-', '').toLowerCase();
        const costo = stringify(vehiculo.Costo);

        let termino = '';
        switch (this.typeVehiculo) {
          case 'caracteristicas':
            this.searchTitleVehiculo = 'Buscando Características'
            termino = caracteristicas;
            break;
          case 'marca':
            this.searchTitleVehiculo = 'Buscando Marca'
            termino = marca;
          break;
          case 'modelo':
            this.searchTitleVehiculo = 'Buscando Modelo'
            termino = modelo;
          break;
          case 'anio':
            this.searchTitleVehiculo = 'Buscando Año'
            termino = anio;
          break;
          case 'clase':
            this.searchTitleVehiculo = 'Buscando Clase'
            termino = clase;
          break;
          case 'llantas':
            this.searchTitleVehiculo = 'Buscando Llantas'
            termino = llantas;
          break;
          case 'placa':
            this.searchTitleVehiculo = 'Buscando Placa'
            termino = placa;
          break;
          case 'matricula':
            this.searchTitleVehiculo = 'Buscando Matrícula'
            termino = matricula;
          break;
          case 'color':
            this.searchTitleVehiculo = 'Buscando Color'
            termino = color;
          break;
          case 'costo':
            this.searchTitleVehiculo = 'Buscando Costo'
            termino = costo;
          break;
          case 'todo':
            this.searchTitleVehiculo = 'Buscando Todo'
            termino = caracteristicas + marca + modelo + anio + clase + llantas + placa + color + costo + matricula
          break;
        }
        if (termino.indexOf(this.searchTextVehiculo.toLowerCase().replace(/' '/g, '')) > -1) {
          this.vehiculos.push(vehiculo)
        }
      }
    } else {
      this.vehiculos = this.bufferVehiculos;
      switch (this.typeVehiculo) {
        case 'caracteristicas':
          this.searchTitleVehiculo = 'Buscando Características'
          break;
        case 'marca':
          this.searchTitleVehiculo = 'Buscando Marca'
        break;
        case 'modelo':
          this.searchTitleVehiculo = 'Buscando Modelo'
        break;
        case 'anio':
          this.searchTitleVehiculo = 'Buscando Año'
        break;
        case 'clase':
          this.searchTitleVehiculo = 'Buscando Clase'
        break;
        case 'llantas':
          this.searchTitleVehiculo = 'Buscando Llantas'
        break;
        case 'placa':
          this.searchTitleVehiculo = 'Buscando Placa'
        break;
        case 'matricula':
          this.searchTitleVehiculo = 'Buscando Matrícula'
        break;
        case 'color':
          this.searchTitleVehiculo = 'Buscando Color'
        break;
        case 'costo':
          this.searchTitleVehiculo = 'Buscando Costo'
        break;
        case 'todo':
          this.searchTitleVehiculo = 'Buscando Todo'
        break;
      }
    }
  }
 testPDF() {
   var doc = new jsPDF('p', 'pt', 'a4') as jsPDFWithPlugin;
   let page = 1;
   let totalPages = 10;
   doc.setFontSize(20);
   doc.setTextColor(40)
   
 }
  getPdf(){
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "Vehículos_H"+fecha.getHours()+"_"+fecha.getMinutes()+"_"+fecha.getSeconds()+"_F"+fecha.getDate()+"_"+(fecha.getMonth() +1)+"_"+fecha.getFullYear();
    const imageData = "/assets/img/logos/mae16-9.png",
          format = "PNG",
          x =17,
          y =17,
          width = 40,
          height = 40,
          alias = "",
          compression = "MEDIUM",
          rotation = 0

    // ancho maximo 446

    const DateOptions:any = {
      align: 'right'
    }
    doc.setFont('Helvetica','','normal');
    doc.setFontSize(10);
    doc.text(
      "Fecha: " + this.datePipe.transform(fecha, 'd, MMMM, yyyy. h:mm a'),
      // "Fecha: " + fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()+", "+fecha.getDate()+" de "+(fecha.getMonth() +1)+" del "+fecha.getFullYear(), 
      416, 
      63, 
      DateOptions
      );
    const BodyOptions:any = {
      align: 'left'
    }
    let subtitulo= 'Informe de Parque Automotor: ';  
    if (this.searchTextVehiculo && this.searchTextVehiculo != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleVehiculo + ', que contenga: "' + this.searchTextVehiculo +'".';
    } else {
      subtitulo = subtitulo + 'Informe General';
    }
  
    doc.setFont('Helvetica','','normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 79, BodyOptions);
    let margin: any = {
      bottom: 80,
      top: 80
    };

    let body = [];

    for (const vehiculo of this.vehiculos) {
      body.push([
        ''+vehiculo.Marca, ''+vehiculo.Modelo, ''+vehiculo.Anio, ''+vehiculo.Placa, ''+vehiculo.Matricula, this.currencyPipe.transform(vehiculo.Costo, 'US$'), this.datePipe.transform((vehiculo.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
      ])
    }
    doc.autoTable({
      head:[['Marca', 'Modelo', 'Año', 'Placa', 'Matrícula', 'Costo', 'Ingreso']],
      body: body,
      startY:86,
      pageBreak: 'auto',
      theme: 'striped',
      margin: margin
    })
    let identity = JSON.parse(localStorage.getItem('Identity'));
    let Cedula = identity.Empleado.Ci;
    let Nombres = identity.Empleado.Nombres + ' ' + identity.Empleado.Apellidos;
    let Cargo = identity.Empleado.Cargo;

    
    for (let i = 1; i <=  doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      // CABECERAS 
      doc.addImage(imageData, format, x, y, width, height, alias, compression, rotation);
      let lastPageHeight = doc.internal.pageSize.height -70;
      const titleOptions: any = {
        align: 'center'
      }
      doc.setFont('Helvetica', '', 'bold');
      doc.setFontSize(22);
      doc.text("MINISTERIO DEL AMBIENTE", doc.internal.pageSize.width / 2, 37, titleOptions);
      doc.setFont('Helvetica', '', 'normal');
      doc.setFontSize(14);
      doc.text("DIRECCIÓN PROVINCIAL DEL AMBIENTE DE PASTAZA", doc.internal.pageSize.width / 2, 50, titleOptions);
      // FIN CABECERAS

      // Pie de Página
      doc.setFontSize(8);
      doc.text('Página '+i+' de '+ doc.getNumberOfPages() + '.', 28, doc.internal.pageSize.height - 32);
      doc.addImage("/assets/img/logos/logo-ambiente.jpg", 'jpg', doc.internal.pageSize.width -(70 + 30), doc.internal.pageSize.height - (70 - 10), 70, 70, alias, compression, rotation);
      // Fin Pie de Página
      if(i == doc.getNumberOfPages()) {
        // doc.internal.pageSize.height = doc.internal.pageSize.height + 80;
        doc.setFontSize(11);
        // doc.text("Emitido por:", doc.internal.pageSize.width / 2, doc.internal.pageSize.height -80, titleOptions);
        doc.setFont('Helvetica','','normal');
        doc.setFontSize(11);
        doc.text("Emitido por: " + Nombres, doc.internal.pageSize.width / 2, doc.internal.pageSize.height -50, titleOptions);
        doc.text(Cedula, doc.internal.pageSize.width / 2, doc.internal.pageSize.height -40, titleOptions);
        doc.text(Cargo, doc.internal.pageSize.width / 2, doc.internal.pageSize.height -30, titleOptions);
      }
    }

    // GUARDADO DEL ARCHIVO
    doc.save(Nombre+".pdf");
    // doc.save("test"+".pdf");
  }

}
