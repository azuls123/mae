import { Component, OnInit } from '@angular/core';
import { OrdenCombustibleService } from '../../../services/ordenCombustible.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { OrdenCombustibleModel } from '../../../models/ordenCombustible.model';
import { EmpleadoService } from '../../../services/empleado.service';
import { IvaService } from '../../../services/iva.service';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { UserOptions } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
@Component({
  selector: 'app-combustible',
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.scss'],
  providers: [OrdenCombustibleService, VehiculoService, EmpleadoService, IvaService, CurrencyPipe, DatePipe, DecimalPipe]
})
export class CombustibleComponent implements OnInit {
  //filtros
  public typeCombustible: string = 'todo';
  public searchTitleCombustible: string = 'Buscando Todo';
  public searchTextCombustible: string;

  public iva: any;

  public viewedCombustible;
  public Combustibles: any[] = [];
  public BufferCombustibles: any[] = [];

  public viewedResponsable: any;
  public viewedVehiculo: any;

  public Vehiculos: any[] = [];
  public Empleados: any[] = [];

  public selectedVehiculo: any;
  public paginationDataCombustibles = {
    itemsPerPage: 10,
    currentPage: 1
  }

  public newOrdenCombustible: OrdenCombustibleModel;

  public isUser: boolean = false;

  constructor(
    private _OrdenCombustibleService: OrdenCombustibleService,
    private _vehiculoService: VehiculoService,
    private _EmpleadoService: EmpleadoService,
    private _IvaService: IvaService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe
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
    this.initNewOrdenCombustible();
    this.loadVehiculos();
    this.loadEmpleados();
    this.loadOrdenCombustibles();
    this.getIvaActual();
  }


  onSubmit() {
    console.log(this.newOrdenCombustible);
    (this.newOrdenCombustible && this.newOrdenCombustible._id != '') ? this.onUpdate() : this.onCreate();
  }
  onCreate() {
    this._OrdenCombustibleService.Crear(this.newOrdenCombustible).subscribe(
      response => {
        this.initNewOrdenCombustible();
        this.loadEmpleados();
        this.loadVehiculos();
        this.loadOrdenCombustibles();
      }
    )
  }
  onUpdate() {

    this._OrdenCombustibleService.Editar(this.newOrdenCombustible).subscribe(
      response => {
        this.initNewOrdenCombustible();
        this.loadEmpleados();
        this.loadVehiculos();
        this.loadOrdenCombustibles();
        this.getIvaActual();
      }
    )
  }
  loadOrdenCombustibles() {
    this._OrdenCombustibleService.Leer().subscribe(
      response => {
        this.Combustibles = response.OrdenCombustibles;
        this.BufferCombustibles = this.Combustibles;
      }
    )
  }


  getIvaActual() {
    this._IvaService.IvaActual().subscribe(
      response => {
        this.iva = response.Iva;
        this.newOrdenCombustible.IVA = response.Iva._id;
      }
    )
  }

  initNewOrdenCombustible() {
    this.newOrdenCombustible = {
      _id: '',
      Numero: 0,
      Fecha: '',
      Responsable: '',
      Vehiculo: '',
      Motivo: '',
      Aceite: '',
      Cantidad: 0,
      Combustible: '',
      Valor: 0,
      IVA: ''
    }
    this.viewedResponsable = null;
    this.viewedVehiculo = null;
    this.getIvaActual();
  }

  loadEmpleados() {
    this._EmpleadoService.Leer().subscribe(
      response => {
        this.Empleados = response.Empleados;
      }
    )
  }
  loadVehiculos() {
    this._vehiculoService.Leer().subscribe(
      response => {
        this.Vehiculos = response.Vehiculos;
      }
    )
  }
  setVehiculo(Placa: string) {
    let obj = this.Vehiculos.find(vehiculo => vehiculo.Placa == Placa);
    return obj;
  }

  setResponsable(Ci: string) {
    let obj = this.Empleados.find(empleado => empleado.Ci == Ci)
    return obj;
  }

  defineCombustible() {
    this.Combustibles = [];
    if (this.searchTextCombustible !== '' && this.searchTextCombustible != undefined) {
      // console.log(this.searchTextCombustible);
      for (const Combustible of this.BufferCombustibles) {
        const numero = Combustible.Numero.toString();
        const nombres = Combustible.Responsable.Nombres.toLowerCase().replace(/[^\w]/gi, '');
        const apellidos = Combustible.Responsable.Apellidos.toLowerCase().replace(/[^\w]/gi, '');
        const cedula = Combustible.Responsable.Ci.toLowerCase().replace(/[^\w]/gi, '');
        const area = Combustible.Responsable.Area.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = Combustible.Responsable.Telefono.toLowerCase().replace(/[^\w]/gi, '');
        const cargo = Combustible.Responsable.Cargo.toLowerCase().replace(/[^\w]/gi, '');
        const motivo = Combustible.Motivo.toLowerCase().replace(/[^\w]/gi, '');
        const aceite = Combustible.Aceite.toLowerCase().replace(/[^\w]/gi, '');
        // const cantidad = Combustible.Cantidad;
        const combustible = Combustible.Combustible;
        let termino = '';
        switch (this.typeCombustible) {
          case 'numero':
            this.searchTitleCombustible = 'Buscando Número';
            termino = numero;
            break;
          case 'nombres':
            this.searchTitleCombustible = 'Buscando Nombres del Responsable';
            termino = nombres;
            break;
          case 'apellidos':
            this.searchTitleCombustible = 'Buscando Apellidos del Responsable';
            termino = apellidos;
            break;
          case 'telefono':
            this.searchTitleCombustible = 'Buscando Teléfono del Responsable';
            termino = telefono;
            break;
          case 'area':
            this.searchTitleCombustible = 'Buscando Area del Responsable';
            termino = area;
            break;
          case 'cargo':
            this.searchTitleCombustible = 'Buscando Cargo del Responsable';
            termino = cargo;
            break;
          case 'cedula':
            this.searchTitleCombustible = 'Buscando Cédula del Responsable';
            termino = cedula;
            break;
          case 'motivo':
            this.searchTitleCombustible = 'Buscando Motivo';
            termino = motivo;
            break;
          case 'aceite':
            this.searchTitleCombustible = 'Buscando Datos de Aceite o Refrigerante';
            termino = aceite;
            break;
          case 'combustible':
            this.searchTitleCombustible = 'Buscando Tipo de Combustible';
            termino = combustible;
            break;
          case 'todo':
            this.searchTitleCombustible = 'Buscando Todo';
            termino = numero + nombres + apellidos + telefono + area + cargo + cedula + motivo + aceite + combustible;
            break;
        }
        if (termino.indexOf(this.searchTextCombustible.toLowerCase().replace(/[^\w]/gi, '')) > -1) {
          this.Combustibles.push(Combustible)
        }
      }
    } else {
      this.Combustibles = this.BufferCombustibles;
      switch (this.typeCombustible) {
        case 'numero':
          this.searchTitleCombustible = 'Buscando Número';
          break;
        case 'nombres':
          this.searchTitleCombustible = 'Buscando Nombres del Responsable';
          break;
        case 'apellidos':
          this.searchTitleCombustible = 'Buscando Apellidos del Responsable';
          break;
        case 'telefono':
          this.searchTitleCombustible = 'Buscando Teléfono del Responsable';
          break;
        case 'area':
          this.searchTitleCombustible = 'Buscando Area del Responsable';
          break;
        case 'cargo':
          this.searchTitleCombustible = 'Buscando Cargo del Responsable';
          break;
        case 'cedula':
          this.searchTitleCombustible = 'Buscando Cédula del Responsable';
          break;
        case 'motivo':
          this.searchTitleCombustible = 'Buscando Motivo';
          break;
        case 'aceite':
          this.searchTitleCombustible = 'Buscando Datos de Aceite o Refrigerante';
          break;
        case 'combustible':
          this.searchTitleCombustible = 'Buscando Tipo de Combustible';
          break;
        case 'todo':
          this.searchTitleCombustible = 'Buscando Todo';
          break;
      }
    }
  }

  ngOnInit() {
  }
  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "OrdenesCombustible_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
    const imageData = "/assets/img/logos/mae16-9.png",
      format = "PNG",
      x = 17,
      y = 17,
      width = 40,
      height = 40,
      alias = "",
      compression = "MEDIUM",
      rotation = 0

    // ancho maximo 446


    const DateOptions: any = {
      align: 'right'
    }
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(10);
    doc.text(
      "Fecha: " + this.datePipe.transform(fecha, 'd, MMMM, yyyy. h:mm a'),
      // "Fecha: " + fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()+", "+fecha.getDate()+" de "+(fecha.getMonth() +1)+" del "+fecha.getFullYear(), 
      416,
      63,
      DateOptions
    );
    const BodyOptions: any = {
      align: 'left'
    }
    let subtitulo = 'Informe de Ordenes de Combustible: ';
    if (this.searchTextCombustible && this.searchTextCombustible != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleCombustible + ', que contenga: "' + this.searchTextCombustible + '".';
    } else {
      subtitulo = subtitulo + 'Informe General';
    }
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 79, BodyOptions);
    let margin: any = {
      bottom: 80,
      top: 80
    };
    let body = [];

    for (const Combustible of this.Combustibles) {
      body.push([
        Combustible.Numero, 
        this.datePipe.transform(Combustible.Fecha, 'd, MMMM, yyyy h:mm a'),
        Combustible.Responsable.Ci + ' - ' + Combustible.Responsable.Nombres + ' ' + Combustible.Responsable.Apellidos + '. ' + Combustible.Responsable.Cargo + '.',
        Combustible.Vehiculo.Placa + ' - ' + Combustible.Vehiculo.Marca + ' ' + Combustible.Vehiculo.Modelo + ' ' + Combustible.Vehiculo.Anio,
        Combustible.Combustible,
        Combustible.Motivo,
        this.decimalPipe.transform(Combustible.Cantidad),
        this.currencyPipe.transform(Combustible.Valor) + ' ('+Combustible.IVA.Valor+'%.)'
        // Combustible.Ci, Combustible.Nombres + ' ' + Combustible.Apellidos, Combustible.Cargo, Combustible.Area, this.datePipe.transform((Combustible.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
        // ''+vehiculo.Marca, ''+vehiculo.Modelo, ''+vehiculo.Anio, ''+vehiculo.Placa, ''+vehiculo.Matricula, this.currencyPipe.transform(vehiculo.Costo, 'US$')
      ])
    }
    doc.autoTable({
      head: [['Número', 'Fecha', 'Responsable', 'Vehículo', 'Combustible', 'Motivo', 'Cantidad', 'Valor']],
      body: body,
      startY: 86,
      pageBreak: 'auto',
      margin: margin
    })

    let identity = JSON.parse(localStorage.getItem('Identity'));
    let Cedula = identity.Empleado.Ci;
    let Nombres = identity.Empleado.Nombres + ' ' + identity.Empleado.Apellidos;
    let Cargo = identity.Empleado.Cargo;

    // doc.setPage(doc.getNumberOfPages());
    // doc.internal.pageSize.height = lastPageHeight;
    // doc.setFont('Helvetica', '', 'normal');
    // doc.setFontSize(14);
    // doc.text("DIRECCIÓN PROVINCIAL DEL AMBIENTE DE PASTAZA", 223, doc.internal.pageSize.height -50, titleOptions);

    // Fin del Documento 

    for (let i = 1; i <= doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      // CABECERAS 
      doc.addImage(imageData, format, x, y, width, height, alias, compression, rotation);
      let lastPageHeight = doc.internal.pageSize.height - 70;
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
      doc.text('Página ' + i + ' de ' + doc.getNumberOfPages() + '.', 28, doc.internal.pageSize.height - 32);
      doc.addImage("/assets/img/logos/logo-ambiente.jpg", 'jpg', doc.internal.pageSize.width - (70 + 30), doc.internal.pageSize.height - (70 - 10), 70, 70, alias, compression, rotation);
      // Fin Pie de Página
      if (i == doc.getNumberOfPages()) {
        // doc.internal.pageSize.height = doc.internal.pageSize.height + 80;
        doc.setFontSize(11);
        // doc.text("Emitido por:", doc.internal.pageSize.width / 2, doc.internal.pageSize.height -80, titleOptions);
        doc.setFont('Helvetica', '', 'normal');
        doc.setFontSize(11);
        doc.text("Emitido por: " + Nombres, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 50, titleOptions);
        doc.text(Cedula, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 40, titleOptions);
        doc.text(Cargo, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 30, titleOptions);
      }
    }
    // GUARDADO DEL ARCHIVO
    // doc.autoPrint();
    doc.save(Nombre + ".pdf");
    // doc.save("test"+".pdf");
  }
  getDetailedPdf(Object) {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "OrdenCombustibleNo."+ Object.Numero +"_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
    const imageData = "/assets/img/logos/mae16-9.png",
      format = "PNG",
      x = 17,
      y = 17,
      width = 40,
      height = 40,
      alias = "",
      compression = "MEDIUM",
      rotation = 0

    // ancho maximo 446


    const DateOptions: any = {
      align: 'right'
    }
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(10);
    doc.text(
      "Fecha: " + this.datePipe.transform(fecha, 'd, MMMM, yyyy. h:mm a'),
      // "Fecha: " + fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()+", "+fecha.getDate()+" de "+(fecha.getMonth() +1)+" del "+fecha.getFullYear(), 
      416,
      63,
      DateOptions
    );
    const BodyOptions: any = {
      align: 'left'
    }
    let subtitulo = 'Orden de Combustible No.: '+Object.Numero + '. De la Fecha: ' + this.datePipe.transform(Object.Fecha, 'd, MMMM, yyyy h:mm a');
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 79, BodyOptions);
    let margin: any = {
      bottom: 80,
      top: 80
    };
    let body = [
      ['Responsable: ', Object.Responsable.Ci + ' - ' + Object.Responsable.Nombres + ' ' + Object.Responsable.Apellidos + '. ' + Object.Responsable.Cargo + '.'],
      ['Vehículo: ', Object.Vehiculo.Placa + ' - ' + Object.Vehiculo.Marca + ' ' + Object.Vehiculo.Modelo + ' ' + Object.Vehiculo.Anio],
      ['Tipo de Combustible: ', Object.Combustible],
      ['Motivo: ', Object.Motivo],
      ['Cantidad: ', Object.Cantidad],
      ['Valor: ', this.currencyPipe.transform(Object.Valor) + ' (' + Object.IVA.Valor + '%).']
    ];
    doc.autoTable({
      body: body,
      startY: 96,
      pageBreak: 'auto',
      margin: margin
    })

    let identity = JSON.parse(localStorage.getItem('Identity'));
    let Cedula = identity.Empleado.Ci;
    let Nombres = identity.Empleado.Nombres + ' ' + identity.Empleado.Apellidos;
    let Cargo = identity.Empleado.Cargo;
    // Fin del Documento 

    for (let i = 1; i <= doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      // CABECERAS 
      doc.addImage(imageData, format, x, y, width, height, alias, compression, rotation);
      let lastPageHeight = doc.internal.pageSize.height - 70;
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
      doc.text('Página ' + i + ' de ' + doc.getNumberOfPages() + '.', 28, doc.internal.pageSize.height - 32);
      doc.addImage("/assets/img/logos/logo-ambiente.jpg", 'jpg', doc.internal.pageSize.width - (70 + 30), doc.internal.pageSize.height - (70 - 10), 70, 70, alias, compression, rotation);
      // Fin Pie de Página
      if (i == doc.getNumberOfPages()) {
        doc.setFontSize(11);
        doc.setFont('Helvetica', '', 'normal');
        doc.setFontSize(11);
        doc.text("Emitido por: " + Nombres, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 50, titleOptions);
        doc.text(Cedula, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 40, titleOptions);
        doc.text(Cargo, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 30, titleOptions);
      }
    }
    // GUARDADO DEL ARCHIVO
    doc.save(Nombre + ".pdf");
  }
}
