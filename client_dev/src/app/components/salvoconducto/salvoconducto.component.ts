import { Component, OnInit } from '@angular/core';

import { SalvoConductoService } from '../../../services/salvoconducto.service';
import { SalvoConductoModel } from '../../../models/salvoconducto.model';
import { EmpleadoService } from '../../../services/empleado.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-salvoconducto',
  templateUrl: './salvoconducto.component.html',
  styleUrls: ['./salvoconducto.component.scss'],
  providers: [SalvoConductoService, EmpleadoService, VehiculoService, CurrencyPipe, DatePipe,DecimalPipe]
})
export class SalvoconductoComponent implements OnInit {

  public newSalvoConducto: SalvoConductoModel;

  public FechaInicio;
  public FechaFin;

  public SelectedEmpleado: any;
  public SelectedVehiculo: any;

  public vehiculos: any[] = [];
  public bufferVehiculos: any[] = [];

  public Empleados: any[] = [];
  public BufferEmpleados: any[] = [];

  //filtros
  public typeEmpleado: string = 'todo';
  public searchTitleEmpleado: string = 'Buscando Todo';
  public searchTextEmpleado: string;

  public typeVehiculo: string = 'todo';
  public searchTitleVehiculo: string = 'Buscando Todo';
  public searchTextVehiculo: string;

  public typeSalvo: string = 'todo';
  public searchTitleSalvo: string = 'Buscando Todo';
  public searchTextSalvo: string;

  public viewedSalvo;
  
  public paginationDataEmpleados = {
    id: 'Empleado',
    itemsPerPage: 7,
    currentPage: 1
  }
  public paginationDataVehiculo = {
    id: 'Vehículo',
    itemsPerPage: 7,
    currentPage: 1
  }
  public paginationDataSalvo = {
    id: 'Salvoconducto',
    itemsPerPage: 10,
    currentPage: 1
  }

  public Salvoconductos: any[] = [];
  public BufferSalvoconductos: any[] = [];
  public BufferSalvoconductosFiltered: any[] = [];

  constructor(
    private _SalvoConductoService: SalvoConductoService,
    private _EmpleadoService: EmpleadoService,
    private _VehiculoService: VehiculoService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) { 
    this.initNewSalvoConducto();
    this.loadEmpleados();
    this.loadVehiculos();
    this.loadSalvoConductos();
  }
  loadSalvoConductos() {
    this._SalvoConductoService.Leer().subscribe(
      response => {
        // console.log(response);
        response.Salvoconductos = response.Salvoconductos.sort((b,a) => a.Numero - b.Numero);
        if (response.Salvoconductos.length >= 1) {
          response.Salvoconductos.forEach(salvo => {
            if (salvo.Estado == 'Aprobado' || salvo.Estado == 'Procesado') salvo.KmInicial = salvo.Vehiculo.Recorrido;
          });
        }
        this.Salvoconductos = response.Salvoconductos
        this.BufferSalvoconductos = response.Salvoconductos
        this.BufferSalvoconductosFiltered = response.Salvoconductos
      }
    )
  }
  loadVehiculos() {
    this._VehiculoService.Leer().subscribe(
      response => {
        this.vehiculos = response.Vehiculos;
        this.bufferVehiculos = response.Vehiculos;
      }
    )
  }
  loadEmpleados() {
    this._EmpleadoService.LeerCargo('Conductor').subscribe(
      response => {
        // console.log(response);
        this.Empleados = response.Empleados;
        this.BufferEmpleados = response.Empleados;
        
      }
    )
  }
  ngOnInit(): void {
  }

  initNewSalvoConducto() {
    this.newSalvoConducto = {
      _id: '',
      Numero: 0,
      Lugar: {
        Origen: '',
        Destino: ''
      },
      Fecha: {
        Salida: '',
        Estimada: '',
        Regreso: ''
      },
      Emision: {
        Lugar: '',
        Fecha: ''
      },
      Conductor: '',
      Recorrido: 0,
      Motivo: '',
      Vehiculo: '',
      KmInicial: 0,
      Estado: 'Procesado',
    }
  
  }

  
  defineEmpleado() {
    this.Empleados = [];
    if (this.searchTextEmpleado !== '' && this.searchTextEmpleado != undefined) {
      // console.log(this.searchTextEmpleado);
      for (const empleado of this.BufferEmpleados) {
        const cedula = empleado.Ci.toLowerCase().replace(/[^\w]/gi, '');
        const nombres = empleado.Nombres.toLowerCase().replace(/[^\w]/gi, '');
        const apellidos = empleado.Apellidos.toLowerCase().replace(/[^\w]/gi, '');
        const area = empleado.Area.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = empleado.Telefono.toLowerCase().replace(/[^\w]/gi, '');
        const cargo = empleado.Cargo.toLowerCase().replace(/[^\w]/gi, '');
        let termino = '';
        switch (this.typeEmpleado) {
          case 'nombres':
            this.searchTitleEmpleado = 'Buscando Nombres';
            termino = nombres;
            break;
          case 'apellidos':
            this.searchTitleEmpleado = 'Buscando Apellidos...';
            termino = apellidos;
            break;
          case 'telefono':
            this.searchTitleEmpleado = 'Buscando Teléfono...';
            termino = telefono;
            break;
          case 'area':
            this.searchTitleEmpleado = 'Buscando Area...';
            termino = area;
            break;
          case 'cargo':
            this.searchTitleEmpleado = 'Buscando Cargo...';
            termino = cargo;
            break;
          case 'cedula':
            this.searchTitleEmpleado = 'Buscando Cédula...';
            termino = cedula;
            break;
          case 'todo':
            this.searchTitleEmpleado = 'Buscando Todo';
            termino = apellidos + nombres + telefono + cedula + area + cargo;
            break;
        }
        // console.log(termino);

        if (termino.indexOf(this.searchTextEmpleado.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Empleados.push(empleado)
        }
      }
    } else {
      this.Empleados = this.BufferEmpleados;
      switch (this.typeEmpleado) {
        case 'nombres':
          this.searchTitleEmpleado = 'Buscando Nombres';
          break;
        case 'apellidos':
          this.searchTitleEmpleado = 'Buscando Apellidos...';
          break;
        case 'telefono':
          this.searchTitleEmpleado = 'Buscando Teléfono...';
          break;
        case 'area':
          this.searchTitleEmpleado = 'Buscando Area...';
          break;
        case 'cargo':
          this.searchTitleEmpleado = 'Buscando Cargo...';
          break;
        case 'cedula':
          this.searchTitleEmpleado = 'Buscando Cédula...';
          break;
        case 'todo':
          this.searchTitleEmpleado = 'Buscando Todo';
          break;
      }
    }
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
        const costo = vehiculo.Costo.replace('.', '').toLowerCase();

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
  defineSalvo() {
    this.Salvoconductos = [];
    this.BufferSalvoconductosFiltered = [];
    let SalvoArray;
    if (this.searchTextSalvo != '' && this.searchTextSalvo != undefined) {
      for (const salvo of this.BufferSalvoconductos) {
        const numero    = salvo.Numero;
        const motivo    = salvo.Motivo.replace(/['']/gi, '').toLowerCase();
        const placas    = salvo.Vehiculo.Placa.replace(/['-']/gi, '').toLowerCase();
        const destino   = salvo.Lugar.Destino.replace(/[' ']/gi, '').toLowerCase();
        const estado    = salvo.Numero;
        let conductor = salvo.Conductor.Nombres.replace(/[' ']/gi, '').toLowerCase();
            conductor += salvo.Conductor.Apellidos.replace(/[' ']/gi, '').toLowerCase();
            conductor += salvo.Conductor.Ci.replace(/['-']/gi, '');

        let termino = '';
        switch (this.typeSalvo) {
          case 'numero':
            this.searchTitleSalvo = 'Buscando Número de Salvo'
            termino = numero;
            break;
          case 'motivo':
            this.searchTitleSalvo = 'Buscando Motivo'
            termino = motivo;
          break;
          case 'placas':
            this.searchTitleSalvo = 'Buscando Placas de Vehículo'
            termino = placas;
          break;
          case 'destino':
            this.searchTitleSalvo = 'Buscando Destino'
            termino = destino;
          break;
          case 'estado':
            this.searchTitleSalvo = 'Buscando Estado del Salvo'
            termino = estado;
          break;
          case 'todo':
            this.searchTitleSalvo = 'Buscando Todo'
            termino = numero + motivo + placas + destino + estado;
          break;
        }
        if (termino.indexOf(this.searchTextSalvo.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Salvoconductos.push(salvo);
          this.BufferSalvoconductosFiltered.push(salvo);
        }
      }
    } else {
      this.Salvoconductos = this.BufferSalvoconductos;
      this.BufferSalvoconductosFiltered = this.BufferSalvoconductos;
      switch (this.typeSalvo) {
        case 'numero':
          this.searchTitleSalvo = 'Buscando Número de Salvo'
          break;
        case 'motivo':
          this.searchTitleSalvo = 'Buscando Motivo'
        break;
        case 'placas':
          this.searchTitleSalvo = 'Buscando Placas de Vehículo'
        break;
        case 'destino':
          this.searchTitleSalvo = 'Buscando Destino'
        break;
        case 'estado':
          this.searchTitleSalvo = 'Buscando Estado del Salvo'
        break;
        case 'todo':
          this.searchTitleSalvo = 'Buscando Todo'
        break;
      }
    }
  }
  onSubmit() {
    console.log(this.newSalvoConducto);
    
    (this.newSalvoConducto._id != '')? this.onUpdate(): this.onCreate();
  }
  onUpdate() {
    this._SalvoConductoService.Editar(this.newSalvoConducto).subscribe(
      response => {
        this.initNewSalvoConducto();
        this.loadSalvoConductos();
        this.SelectedEmpleado = undefined;
        this.SelectedVehiculo = undefined;
      }
    )
  }
  onCreate() {
    this._SalvoConductoService.Crear(this.newSalvoConducto).subscribe(
      response => {
        this.initNewSalvoConducto();
        this.loadSalvoConductos();
        this.SelectedEmpleado = undefined;
        this.SelectedVehiculo = undefined;
      }
    )
  }

  updateVehiculo(vehiculo){
    this._VehiculoService.Editar(vehiculo).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(error as any);
        
      }
    )
  }

  setDate() {
    let inicio = new Date(this.FechaInicio), 
          fin = new Date(this.FechaFin);
    // inicio.setDate(inicio.getDate() + 1);
    // fin.setDate(this.FechaFin + 1)
    let inicioNum = inicio.getDate();
    let finNum = fin.getDate();
    inicio.setDate(inicioNum +1);
    fin.setDate(finNum +1);
    inicio.setHours(0,0,0,0);
    fin.setHours(23,59,59,999);
    
    if (this.FechaInicio && this.FechaFin) {
      if (fin >= inicio) {
        this.Salvoconductos = [];
        for (const salvo of this.BufferSalvoconductosFiltered) {
          const fecha = new Date(salvo.Emision.Fecha);
          if (inicio <= fecha && fecha <= fin) {
            this.Salvoconductos.push(salvo);
          }
        }
      } else {
        this.Salvoconductos = this.BufferSalvoconductosFiltered;
      }
    }
  }

  getDetailPdf(Object) {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "SalvoConducto_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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
      416,
      65,
      DateOptions
    );
    doc.text(
      "No.: " + Object.Numero,
      416,
      78,
      DateOptions
    );
    const BodyOptions: any = {
      align: 'left'
    }
    let subtitulo = 'Orden de Movilización para circulación de Vehículos Institucionales';
    doc.setFont('Helvetica','normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 83, BodyOptions);

    const CenterOptions: any = {
      align: 'center'
    }

    doc.setFont('Helvetica','bold');
    doc.setFontSize(12);
    doc.text('Emisión de la Orden', doc.internal.pageSize.width / 2, 100, CenterOptions);

    doc.text('Lugar:', 30, 115, {align: 'left'});
    doc.setFont('Helvetica', 'normal');
    doc.text(Object.Emision.Lugar+'.', 30 + doc.getTextWidth('Lugar:_.'), 115, {align: 'left'});

    doc.text(this.datePipe.transform(Object.Emision.Fecha, 'd, MMMM, yyyy. h:mm a') + '.', doc.internal.pageSize.width - 30, 115, {align:'right'})
    doc.setFont('Helvetica', 'bold')
    doc.text('Lugar y Fecha: ', (doc.internal.pageSize.width - 30 ) - doc.getTextWidth(this.datePipe.transform(Object.Emision.Fecha, 'd, MMMM, yyyy. h:mm a') + '..'),115, {align:'right'});

    doc.text('Motivo de la Movilización', doc.internal.pageSize.width / 2, 135, CenterOptions);
    doc.setFont('Helvetica', 'normal')
    doc.text(Object.Motivo, 30, 150, {align: 'left'});
    
    doc.setFont('Helvetica', 'bold')
    doc.text('Lugar de Origen:', 30, 165, {align: 'left'});
    doc.text('Lugar de Destino:',  (doc.internal.pageSize.width / 2) + 15, 165, {align: 'left'});
    
    doc.setFont('Helvetica', 'normal')
    doc.text(Object.Lugar.Origen, 30, 180, {align: 'left'});
    doc.text(Object.Lugar.Destino, (doc.internal.pageSize.width / 2) + 15, 180, {align: 'left'});
    
    doc.setFont('Helvetica', 'bold')
    doc.text('Fecha de Salida:', 30, 195, {align: 'left'});
    doc.text('Fecha Estimada de Regreso:',  (doc.internal.pageSize.width / 2) + 15, 195, {align: 'left'});
    
    doc.setFont('Helvetica', 'normal')
    doc.text(this.datePipe.transform(Object.Fecha.Salida, 'd, MMMM, yyyy. h:mm a') + '.', 30, 210, {align: 'left'});
    doc.text(this.datePipe.transform(Object.Fecha.Estimada, 'd, MMMM, yyyy. h:mm a') + '.', (doc.internal.pageSize.width / 2) + 15, 210, {align: 'left'});
    let estado = 'Estado: ' + Object.Estado + '. ';
    if (Object.Estado == 'Completado') estado = estado+'Regreso: ' + this.datePipe.transform(Object.Fecha.Regreso, 'd, MMMM, yyyy. h:mm a')
    doc.text(estado, 30, 230);
    doc.setFont('Helvetica', 'bold')
    doc.text('Conductor:', 30, 260, {align: 'left'});
    // doc.setFont('Helvetica', 'normal')
    // doc.text( Object.Conductor.Ci + ', ' + Object.Conductor.Nombres + ' ' + Object.Conductor.Apellidos + ', ' + Object.Conductor.Telefono + '. ' + Object.Conductor.Area , 30, 240, {align: 'left'});
    doc.autoTable({
      head: [['Cédula', 'Nombres', 'Teléfono', 'Area']],
      body: [[Object.Conductor.Ci, Object.Conductor.Nombres + ' ' + Object.Conductor.Apellidos, Object.Conductor.Telefono, Object.Conductor.Area]],
      startY: 275,
      styles: {
        // fontSize: 12,
      },
      pageBreak: 'auto'
    })
    doc.setFont('Helvetica', 'bold')
    doc.text('Vehículo:', 30, 340, {align: 'left'});
    doc.setFont('Helvetica', 'normal')
    let vehiculoHead = [['Vehículo', 'Placa', 'Color', 'Matrícula', 'Km Inicial']];
    let vehiculoBody = [[Object.Vehiculo.Marca + ' ' + Object.Vehiculo.Modelo, Object.Vehiculo.Placa, Object.Vehiculo.Color, Object.Vehiculo.Matricula, (this.decimalPipe.transform(Object.KmInicial)) + ' km.']];
    if (Object.Estado == 'Completado') {
      vehiculoHead[0].push('Recorrido');
      vehiculoBody[0].push((this.decimalPipe.transform(Object.Recorrido)) + ' km.')
    }
    // doc.text( Object.Vehiculo.Marca + ' ' + Object.Vehiculo.Modelo + ', ' + Object.Vehiculo.Placa + ', Color ' + Object.Vehiculo.Color + ', Matrícula No. ' + Object.Vehiculo.Matricula + '. ' + Object.Recorrido + 'km.' , 30, 270, {align: 'left'});
    doc.autoTable({
      head: vehiculoHead,
      body: vehiculoBody,
      startY: 355,
      styles: {
        // fontSize: 12,
      },
      pageBreak: 'auto'
    })
    // doc.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, [1,1], 'F', false)
    doc.line(30,420, doc.internal.pageSize.width - 30, 420 );
    doc.autoTable({
      head: [['Observaciones:']],
      body: [['NOTA: Cualquier Autoridad o Policía de Transito podrá detener los vehículos del Estado que no porten esta ORDEN DE CIRCULACIÓN y que no se encuentren dentro del sector Autorizado.']],
      startY: 435,
      pageBreak: 'auto',
      styles: {
        halign: 'justify',
        // fontSize: 14,
        textColor: '#808080'
      },
      theme: 'plain'
    })
    // Fin del Documento 
    
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
    // doc.autoPrint();
    doc.save(Nombre + ".pdf");
    // doc.save("test"+".pdf");
  }
}
