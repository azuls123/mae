import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';
import { TallerService } from '../../../services/taller.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { TrabajoService } from '../../../services/trabajo.service';
import { OrdenTrabajoService } from '../../../services/ordenTrabajo.service';
import { TrabajoOrdenService } from '../../../services/trabajoOrden.service';
import { OrdenTrabajoModel } from '../../../models/ordenTrabajo.model';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IvaService } from '../../../services/iva.service';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
@Component({
  selector: 'app-ordentrabajo',
  templateUrl: './ordentrabajo.component.html',
  styleUrls: ['./ordentrabajo.component.scss'],
  providers: [VehiculoService, EmpleadoService, TallerService, TrabajoService, IvaService, OrdenTrabajoService, TrabajoOrdenService, CurrencyPipe, DatePipe]
})
export class OrdentrabajoComponent implements OnInit {

  public Vehiculos: any[] = [];
  public Empleados: any[] = [];
  public Talleres: any[] = [];
  public viewedVehiculo: any;
  public viewedSolicitante: any;
  public viewedTaller: any;
  public Trabajos: any[] = [];

  public tipoTrabajos: any[] = [];

  public SelectedTrabajos: any[] = [
  ];
  public newOrdenTrabajo: OrdenTrabajoModel;

  public viewedOrdenTrabajo: any;
  public viewedTrabajos: any;

  public OrdenTrabajos: any[] = [];
  public BufferOrdenTrabajos: any[] = [];

  public inputVehiculo = '';
  public inputSolicitante = '';
  public inputTaller = '';

  public paginationDataOrdenTrabajo = {
    id: 'OrdenTrabajo',
    itemsPerPage: 7,
    currentPage: 1
  }

  public isUser: boolean = false;

  //filtros
  public typeOrdenTrabajo: string = 'todo';
  public searchTitleOrdenTrabajo: string = 'Buscando Todo';
  public searchTextOrdenTrabajo: string;

  constructor(
    private _VehiculoService: VehiculoService,
    private _EmpleadoService: EmpleadoService,
    private _TallerService: TallerService,
    private _TrabajoService: TrabajoService,
    private _OrdenTrabajoService: OrdenTrabajoService,
    private _TrabajoOrdenService: TrabajoOrdenService,
    private _IvaService: IvaService,
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
    this.loadVehiculos();
    this.loadEmpleados();
    this.loadTalleres();
    this.loadTrabajos();
    this.initSelectedTrabajos();
    this.initNewOrdenTrabajo();
    this.loadOrdenTrabajo();
  }
  ViewOrdenTrabajo(orden) {
    this.viewedOrdenTrabajo = orden;
    const find = {
      Orden: orden._id
    }
    this._TrabajoOrdenService.Leer(find).subscribe(
      response => {
        this.viewedTrabajos = response.TrabajoOrdenes;
      }
    )
  }
  loadOrdenTrabajo() {
    this._OrdenTrabajoService.Leer().subscribe(
      response => {
        this.OrdenTrabajos = response.OrdenTrabajos;
        this.BufferOrdenTrabajos = response.OrdenTrabajos;
      }
    )
  }

  ngOnInit(): void {
  }

  initNewOrdenTrabajo() {
    
    this._IvaService.IvaActual().subscribe(
      response => {
        this.newOrdenTrabajo = {
          _id: '',
          Vehiculo: '',
          Solicitante: '',
          Taller: '',
          Estado: 'Pendiente',
          Numero: 0,
          Total: 0,
          Iva: response.Iva._id
        };
      }
    )
    this.viewedVehiculo = null;
    this.viewedTaller = null;
    this.viewedSolicitante = null;
    this.inputVehiculo = '';
    this.inputSolicitante = '';
    this.inputTaller = '';
  }

  initSelectedTrabajos() {
    this.SelectedTrabajos = [];
    this.addNewTrabajo();
  }

  setEstadoOrden() {
    let estado = 'Pendiente';
    let pendientes = 0;
    let enProceso = 0;
    let completados = 0;
    for (const trabajo of this.viewedTrabajos) {
      if (trabajo.Estado == 'Pendiente') pendientes++;
      if (trabajo.Estado == 'En Proceso') enProceso++;
      if (trabajo.Estado == 'Completado') completados++;
    }
    if (completados == this.viewedTrabajos.length) estado = 'Completado'; else
      if (enProceso == 0 && completados == 0) estado = 'Pendiente'; else
        if (enProceso >= 1 || completados >= 1) estado = 'En Proceso';

    if (estado != this.viewedOrdenTrabajo.Estado) {
      let Total = 0;
      for (const trabajo of this.viewedTrabajos) {
        Total += trabajo.Total;
      }
      this.viewedOrdenTrabajo.Estado = estado;
      this.viewedOrdenTrabajo.Total = Total;
      this._OrdenTrabajoService.Editar(this.viewedOrdenTrabajo).subscribe(
        response => {

        }
      )
    }
  }

  updateTrabajoOrden(trabajo) {
    if ((trabajo.Costo >= 0.05 && trabajo.Estado == 'Pendiente') || trabajo.Estado == 'En Proceso') {
      if (trabajo.Costo >= 0.05 && trabajo.Estado == 'Pendiente') {
        trabajo.Total = trabajo.Costo * trabajo.Cantidad;
        trabajo.Estado = 'En Proceso';
      } else if (trabajo.Estado == 'En Proceso') {
        trabajo.Estado = 'Completado';
      }
      this.setEstadoOrden();
      this._TrabajoOrdenService.Editar(trabajo).subscribe(
        response => {
        }
      )
    }
  }

  addNewTrabajo() {
    this.SelectedTrabajos.push(
      {
        _id: '',
        Trabajo: '',
        Detalles: '',
        Orden: '',
        Cantidad: 0,
        Costo: 0,
        Total: 0
      }
    );
  }

  eraseTrabajo(i) {
    this.SelectedTrabajos.splice(i, 1)
  }

  loadTrabajos() {
    this._TrabajoService.Leer().subscribe(
      response => {
        this.Trabajos = response.Trabajos;
        this.tipoTrabajos = [];
        for (const trabajo of this.Trabajos) {
          if (!(this.tipoTrabajos.find(tipo => tipo == trabajo.Tipo))) this.tipoTrabajos.push(trabajo.Tipo)
        }
      }
    )
  }

  checkTrabajoUnico(id): boolean {
    let check = false;
    for (const trabajo of this.SelectedTrabajos) {
      // console.log(trabajo);

    }
    if (!(this.SelectedTrabajos.find(trabajo => trabajo.trabajo == id))) {
      check = true;
      // console.log('unico');
    } else {
      // console.log('no-unico');
    }
    return check;
  }

  onSubmit() {
    if (this.viewedSolicitante && this.viewedTaller && this.viewedVehiculo) {
      this.newOrdenTrabajo.Solicitante = this.viewedSolicitante._id;
      this.newOrdenTrabajo.Taller = this.viewedTaller._id;
      this.newOrdenTrabajo.Vehiculo = this.viewedVehiculo._id;
      (this.newOrdenTrabajo._id) ? this.onUpdate() : this.onCreate();
    }

  }

  onCreate() {
    console.log('Crear: ', this.newOrdenTrabajo, this.SelectedTrabajos);
    this._OrdenTrabajoService.Crear(this.newOrdenTrabajo).subscribe(
      response => {
        this.initNewOrdenTrabajo();
        for (let trabajo of this.SelectedTrabajos) {
          trabajo.Orden = response.OrdenTrabajo._id;
          this._TrabajoOrdenService.Crear(trabajo).subscribe(
            response => {

            }
          )
        }
        this.initSelectedTrabajos();
        this.loadOrdenTrabajo();
      }
    )
  }

  onUpdate() {
    console.log('Editar: ', this.newOrdenTrabajo, this.SelectedTrabajos);
  }

  setVehiculo(Placa: string) {
    let obj = this.Vehiculos.find(vehiculo => vehiculo.Placa == Placa)
    return obj;
  }
  setSolicitante(Ci: string) {
    let obj = this.Empleados.find(empleado => empleado.Ci == Ci)
    return obj;
  }
  setTaller(ruc) {
    let obj = this.Talleres.find(taller => taller.RUC == ruc);
    return obj;
  }
  loadTalleres() {
    this._TallerService.Leer().subscribe(
      response => {
        this.Talleres = response.Talleres;
      }
    )
  }

  loadEmpleados() {
    this._EmpleadoService.Leer().subscribe(
      response => {
        this.Empleados = response.Empleados;
      }
    )
  }

  loadVehiculos() {
    this._VehiculoService.Leer().subscribe(
      response => {
        this.Vehiculos = response.Vehiculos;
      }
    )
  }

  defineOrdenTrabajo() {
    this.OrdenTrabajos = [];
    if (this.searchTextOrdenTrabajo && this.searchTextOrdenTrabajo != '' && this.searchTextOrdenTrabajo != undefined) {
      for (const orden of this.BufferOrdenTrabajos) {
        const vehiculo = orden.Vehiculo.Caracteristicas.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Vehiculo.Placa.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Vehiculo.Modelo.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Vehiculo.Marca.toLowerCase().replace(/[^\w]/gi, ''),
              solicitante = orden.Solicitante.Nombres.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Solicitante.Apellidos.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Solicitante.Cargo.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Solicitante.Area.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Solicitante.Ci.toLowerCase().replace(/[^\w]/gi, ''),
              taller = orden.Taller.Nombre.toLowerCase().replace(/[^\w]/gi, '')
                + orden.Taller.RUC.toLowerCase().replace(/[^\w]/gi, ''),
              numero = orden.Numero.toString(),
              estado = orden.Estado.toLowerCase().replace(/[^\w]/gi,'');
        let termino = '';
        switch (this.typeOrdenTrabajo) {
          case 'vehiculo':
            this.searchTitleOrdenTrabajo = 'Buscando Vehículo';
            termino = vehiculo;
            break;
          case 'solicitante':
            this.searchTitleOrdenTrabajo = 'Buscando Solicitante';
            termino = solicitante;
            break;
          case 'taller':
            this.searchTitleOrdenTrabajo = 'Buscando Taller';
            termino = taller;
            break;
          case 'numero':
            this.searchTitleOrdenTrabajo = 'Buscando Número';
            termino = numero;
            break;
          case 'estado':
            this.searchTitleOrdenTrabajo = 'Buscando Estado';
            termino = estado;
            break;
          case 'todo':
            this.searchTitleOrdenTrabajo = 'Buscando Todo';
            termino = taller + solicitante + vehiculo + numero + estado;
            break;
        }
        if (termino.indexOf(this.searchTextOrdenTrabajo.toLowerCase().replace(/[^\w]/gi, '')) > -1) {
          this.OrdenTrabajos.push(orden);
        }
      }
    } else {
      this.OrdenTrabajos = this.BufferOrdenTrabajos;
      switch (this.typeOrdenTrabajo) {
        case 'vehiculo':
          this.searchTitleOrdenTrabajo = 'Buscando Vehículo';
          break;
        case 'solicitante':
          this.searchTitleOrdenTrabajo = 'Buscando Solicitante';
          break;
        case 'taller':
          this.searchTitleOrdenTrabajo = 'Buscando Taller';
          break;
        case 'numero':
          this.searchTitleOrdenTrabajo = 'Buscando Número';
          break;
        case 'estado':
          this.searchTitleOrdenTrabajo = 'Buscando Estado';
          break;
        case 'todo':
          this.searchTitleOrdenTrabajo = 'Buscando Todo';
          break;
      }
    }

  }


  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "OrdenesDeTrabajo_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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
    let subtitulo = 'Informe de Ordenes de Trabajo: ';
    if (this.searchTextOrdenTrabajo && this.searchTextOrdenTrabajo != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleOrdenTrabajo + ', que contenga: "' + this.searchTextOrdenTrabajo + '".';
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

    for (const orden of this.OrdenTrabajos) {
      body.push([
        orden.Numero,
        this.datePipe.transform((orden.Created.At * 1000), 'd MMMM yyyy h:mm a'),
        orden.Solicitante.Ci + ' - ' + orden.Solicitante.Nombres + ' ' + orden.Solicitante.Apellidos,
        orden.Vehiculo.Placa + ' - ' + orden.Vehiculo.Marca + ' ' + orden.Vehiculo.Modelo,
        orden.Taller.Nombre + ' ' + orden.Taller.RUC,
        orden.Estado
      ])
    }
    doc.autoTable({
      head: [['No.', 'Fecha', 'Solicitante', 'Vehículo', 'Taller', 'Estado']],
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

  getDetailedPdf(orden) {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "OrdeneDeTrabajo" + orden.Numero + "_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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
    let subtitulo = 'Informe de la Orden de Trabajo Número: ' + orden.Numero + '. Estado: ' + orden.Estado;
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 80, BodyOptions);
    let margin: any = {
      bottom: 80,
      top: 80
    };

    doc.setFont('Helvetica', 'bold');
    doc.text('Vehículo: ', 30, 95);
    doc.setFont('Helvetica', 'normal');
    doc.text(orden.Vehiculo.Placa + ' - ' + orden.Vehiculo.Marca + ' ' + orden.Vehiculo.Modelo + ' de ' + orden.Vehiculo.Anio, doc.getTextWidth('Vehiculo:??') + 30, 95);

    doc.setFont('Helvetica', 'bold');
    doc.text('Solicitante: ', 30, 110);
    doc.setFont('Helvetica', 'normal');
    doc.text(orden.Solicitante.Nombres + ' ' + orden.Solicitante.Apellidos + ', Con Cédula ' + orden.Solicitante.Ci, doc.getTextWidth('Solicitante:??') + 30, 110);

    doc.setFont('Helvetica', 'bold');
    doc.text('Taller: ', 30, 125);
    doc.setFont('Helvetica', 'normal');
    doc.text(orden.Taller.Nombre + ' con RUC: ' + orden.Taller.RUC + ', En la Dirección:  ' + orden.Taller.Direccion, doc.getTextWidth('Taller:??') + 30, 125);


    let body = [];
    let total = 0;
    for (const trabajo of this.viewedTrabajos) {
      body.push([
        trabajo.Trabajo.Tipo + ', ' + trabajo.Trabajo.Descripcion,
        trabajo.Detalles,
        trabajo.Cantidad,
        this.currencyPipe.transform(trabajo.Costo),
        this.currencyPipe.transform(trabajo.Total),
        trabajo.Estado
      ])
      total += trabajo.Total
    }
    let iva = orden.Iva.Valor;
    let subtotal = total - ((total * iva) / 100);
    let subIva = total - subtotal;
    console.log(iva, subtotal, subIva);
    body.push([
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
    body.push([
      '',
      '',
      '',
      '',
      'Subtotal',
      subtotal,
    ]);
    body.push([
      '',
      '',
      '',
      '',
      'IVA',
      subIva,
    ]);
    body.push([
      '',
      '',
      '',
      '',
      'Total',
      total,
    ]);
    doc.autoTable({
      head: [['Trabajo', 'Detalles', 'Cant.', 'Costo', 'Total', 'Estado']],
      body: body,
      startY: 140,
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

}
