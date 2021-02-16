import { Component, OnInit } from '@angular/core';

import { EmpleadoModel } from '../../../models/empleado.model';
import { EmpleadoService } from '../../../services/empleado.service';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { CurrencyPipe, DatePipe } from '@angular/common';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss'],
  providers: [EmpleadoService, CurrencyPipe, DatePipe]
})
export class EmpleadoComponent implements OnInit {


  public paginationDataEmpleados = {
    itemsPerPage: 10,
    currentPage: 1
  }

  public Cargos = [
    'Conductor',
    'Secretario',
    'Indefinido'
  ]

  public newEmpleado: EmpleadoModel;
  public Empleados: any[] = [];
  public BufferEmpleados: any[] = [];
  public viewedEmpleado: any;

  constructor(
    private _empleadoService: EmpleadoService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    this.initEmpleado();
    this.loadEmpleados();
  }

  clearData() {
    this.initEmpleado();
  }

  checkCargosUpdate(): boolean {
    let showSelectCargos: boolean = true;
    if (!this.Cargos.find(cargo => cargo == this.newEmpleado.Cargo) && this.newEmpleado._id) {
      showSelectCargos = false;
    }
    return showSelectCargos;
  }

  toDelete(empleado) {
    empleado.Activo = !empleado.Activo;
    this._empleadoService.Editar(empleado).subscribe(
      response => {
        // console.log(response);
        empleado = response.Empleado;
        // this.loadEmpleados();
      }
    )
  }

  unlinkObject(Obj): any {
    const Stringed = JSON.stringify(Obj);
    const Unlinked = JSON.parse(Stringed);
    return Unlinked;
  }

  loadEmpleados() {
    this._empleadoService.Leer().subscribe(
      response => {
        if (response.Empleados) {
          this.Empleados = response.Empleados;
          this.BufferEmpleados = response.Empleados;
        }
      }
    )
  }

  initEmpleado() {
    this.newEmpleado = {
      _id: undefined,
      Ci: '',
      Nombres: '',
      Apellidos: '',
      Activo: true,
      Cargo: '',
      Telefono: '',
      Area: ''
    }
  }

  onSubmit() {
    (this.newEmpleado._id != undefined && this.newEmpleado._id != '') ? this.onUpdate(this.newEmpleado) : this.onCreate(this.newEmpleado);
  }

  onCreate(empleado) {
    this._empleadoService.Crear(empleado).subscribe(
      response => {
        this.loadEmpleados();
        this.initEmpleado();
      }
    )
  }
  onUpdate(empleado) {
    this._empleadoService.Editar(empleado).subscribe(
      response => {
        this.loadEmpleados();
        this.initEmpleado();
      }
    )
  }

  ngOnInit() {
  }
  //filtros
  public typeEmpleado: string = 'todo';
  public searchTitleEmpleado: string = 'Buscando Todo';
  public searchTextEmpleado: string;
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
            this.searchTitleEmpleado = 'Buscando Apellidos';
            termino = apellidos;
            break;
          case 'telefono':
            this.searchTitleEmpleado = 'Buscando Teléfono';
            termino = telefono;
            break;
          case 'area':
            this.searchTitleEmpleado = 'Buscando Area';
            termino = area;
            break;
          case 'cargo':
            this.searchTitleEmpleado = 'Buscando Cargo';
            termino = cargo;
            break;
          case 'cedula':
            this.searchTitleEmpleado = 'Buscando Cédula';
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
          this.searchTitleEmpleado = 'Buscando Apellidos';
          break;
        case 'telefono':
          this.searchTitleEmpleado = 'Buscando Teléfono';
          break;
        case 'area':
          this.searchTitleEmpleado = 'Buscando Area';
          break;
        case 'cargo':
          this.searchTitleEmpleado = 'Buscando Cargo';
          break;
        case 'cedula':
          this.searchTitleEmpleado = 'Buscando Cédula';
          break;
        case 'todo':
          this.searchTitleEmpleado = 'Buscando Todo';
          break;
      }
    }
  }

  ValCi(ci: string): Boolean {
    let check = false;
    if (ci.length >= 10 && ci.length <= 13) {
      let sumaPares: number = 0, sumaImpares: number = 0, cociente = 0, resta = 0;
      const verificador = parseInt(ci[9]);
      for (let i = 0; i < 9; i += 2) {
        let impar = parseInt(ci[i]) * 2;
        if (impar >= 10) impar -= 9;
        cociente += impar;
      }
      for (let i = 1; i < 9; i += 2) {
        let par = parseInt(ci[i]);
        cociente += par;
      }
      while (resta <= cociente) {
        resta += 10;
      }
      if (verificador == (resta - cociente)) check = true
    }
    // console.log(check);

    return check
  }

  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "Empleados_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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
    let subtitulo = 'Informe de Empleados: ';
    if (this.searchTextEmpleado && this.searchTextEmpleado != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleEmpleado + ', que contenga: "' + this.searchTextEmpleado + '".';
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

    for (const empleado of this.Empleados) {
      body.push([
        empleado.Ci, empleado.Nombres + ' ' + empleado.Apellidos, empleado.Cargo, empleado.Area, this.datePipe.transform((empleado.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
        // ''+vehiculo.Marca, ''+vehiculo.Modelo, ''+vehiculo.Anio, ''+vehiculo.Placa, ''+vehiculo.Matricula, this.currencyPipe.transform(vehiculo.Costo, 'US$')
      ])
    }
    doc.autoTable({
      head: [['Cédula', 'Nombres', 'Cargo', 'Area', 'Ingreso']],
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
