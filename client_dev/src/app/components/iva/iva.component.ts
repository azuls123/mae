import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserOptions } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { IvaService } from '../../../services/iva.service';
import { IvaModel } from '../../../models/iva.model';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-iva',
  templateUrl: './iva.component.html',
  styleUrls: ['./iva.component.scss'],
  providers: [IvaService,  CurrencyPipe, DatePipe]
})
export class IvaComponent implements OnInit {

  //filtros
  public typeIva: string = 'todo';
  public searchTitleIva: string = 'Buscando Todo';
  public searchTextIva: string;

  public viewedIva;

  public Ivas:any[] = [];
  public BufferIvas:any[] = [];

  public paginationDataIvas = {
    itemsPerPage: 10,
    currentPage: 1
  }
  
  public newIva: IvaModel;

  constructor(
    private _IvaService: IvaService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {
    this.initNewIva();
    this.loadIvas();
   }

  ngOnInit() {
  }

  initNewIva(){
    this.newIva = {
      _id: '',
      Fecha: '',
      Valor: 0
    }
  }

  loadIvas() {
    this._IvaService.Leer().subscribe(
      response => {
        response.Ivas.sort(function (a, b) {
          const afterDate = new Date(a.Fecha);
          const beforeDate = new Date(b.Fecha);
          
          if (afterDate > beforeDate) return -1;
          if (afterDate < beforeDate) return 1;
          return 0;
        })
        this.Ivas = response.Ivas;
      }
    )
  }

  onSubmit() {
    (this.newIva && this.newIva._id && this.newIva._id != '') ? this.onUpdate(): this.onCreate();
  }

  onCreate(){
    this._IvaService.Crear(this.newIva).subscribe(
      response => {
        this.loadIvas();
        this.initNewIva();
      }
    )
  }

  onUpdate(){
    this._IvaService.Editar(this.newIva).subscribe(
      response => {
        this.loadIvas();
        this.initNewIva();
      }
    )
  }


  defineIva() {
    this.Ivas = [];
    if (this.searchTextIva !== '' && this.searchTextIva != undefined) {
      // console.log(this.searchTextIva);
      for (const Iva of this.BufferIvas) {
        const numero = Iva.Numero;
        const nombres = Iva.Responsable.Nombres.toLowerCase().replace(/[^\w]/gi, '');
        const apellidos = Iva.Responsable.Apellidos.toLowerCase().replace(/[^\w]/gi, '');
        const cedula = Iva.Responsable.Ci.toLowerCase().replace(/[^\w]/gi, '');
        const area = Iva.Responsable.Area.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = Iva.Responsable.Telefono.toLowerCase().replace(/[^\w]/gi, '');
        const cargo = Iva.Responsable.Cargo.toLowerCase().replace(/[^\w]/gi, '');
        const motivo = Iva.Motivo.toLowerCase().replace(/[^\w]/gi, '');
        const aceite = Iva.Aceite.toLowerCase().replace(/[^\w]/gi, '');
        // const cantidad = Iva.Cantidad;
        const iva = Iva.Iva;
        let termino = '';
        switch (this.typeIva) {
          case 'numero':
            this.searchTitleIva = 'Buscando Número';
            termino = numero;
            break;
          case 'nombres':
            this.searchTitleIva = 'Buscando Nombres del Responsable';
            termino = nombres;
            break;
          case 'apellidos':
            this.searchTitleIva = 'Buscando Apellidos del Responsable';
            termino = apellidos;
            break;
          case 'telefono':
            this.searchTitleIva = 'Buscando Teléfono del Responsable';
            termino = telefono;
            break;
          case 'area':
            this.searchTitleIva = 'Buscando Area del Responsable';
            termino = area;
            break;
          case 'cargo':
            this.searchTitleIva = 'Buscando Cargo del Responsable';
            termino = cargo;
            break;
          case 'cedula':
            this.searchTitleIva = 'Buscando Cédula del Responsable';
            termino = cedula;
            break;
          case 'motivo':
            this.searchTitleIva = 'Buscando Motivo';
            termino = motivo;
            break;
          case 'aceite':
            this.searchTitleIva = 'Buscando Datos de Aceite o Refrigerante';
            termino = aceite;
            break;
          case 'Iva':
            this.searchTitleIva = 'Buscando Tipo de Iva';
            termino = Iva;
            break;
          case 'todo':
            this.searchTitleIva = 'Buscando Todo';
            termino = numero + nombres + apellidos  + telefono + area + cargo + cedula + motivo + aceite + Iva;
            break;
        }
        if (termino.indexOf(this.searchTextIva.toLowerCase().replace(/[^\w]/gi, '')) > -1) {
          this.Ivas.push(Iva)
        }
      }
    } else {
      this.Ivas = this.BufferIvas;
      switch (this.typeIva) {
        case 'numero':
          this.searchTitleIva = 'Buscando Número';
          break;
        case 'nombres':
          this.searchTitleIva = 'Buscando Nombres del Responsable';
          break;
        case 'apellidos':
          this.searchTitleIva = 'Buscando Apellidos del Responsable';
          break;
        case 'telefono':
          this.searchTitleIva = 'Buscando Teléfono del Responsable';
          break;
        case 'area':
          this.searchTitleIva = 'Buscando Area del Responsable';
          break;
        case 'cargo':
          this.searchTitleIva = 'Buscando Cargo del Responsable';
          break;
        case 'cedula':
          this.searchTitleIva = 'Buscando Cédula del Responsable';
          break;
        case 'motivo':
          this.searchTitleIva = 'Buscando Motivo';
          break;
        case 'aceite':
          this.searchTitleIva = 'Buscando Datos de Aceite o Refrigerante';
          break;
        case 'Iva':
          this.searchTitleIva = 'Buscando Tipo de Iva';
          break;
        case 'todo':
          this.searchTitleIva = 'Buscando Todo';
          break;
      }
    }
  }

  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "Ivas_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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
    let subtitulo = 'Informe de Ivas: ';
    // if (this.searchTextIva && this.searchTextIva != '') {
    //   subtitulo = subtitulo + ' ' + this.searchTitleIva + ', que contenga: "' + this.searchTextIva + '".';
    // } else {
    //   subtitulo = subtitulo + 'Informe General';
    // }
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 79, BodyOptions);
    let margin: any = {
      bottom: 80,
      top: 80
    };
    let body = [];

    // for (const Iva of this.Ivas) {
    //   body.push([
    //     Iva.Ci, Iva.Nombres + ' ' + Iva.Apellidos, Iva.Cargo, Iva.Area, this.datePipe.transform((Iva.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
    //     // ''+vehiculo.Marca, ''+vehiculo.Modelo, ''+vehiculo.Anio, ''+vehiculo.Placa, ''+vehiculo.Matricula, this.currencyPipe.transform(vehiculo.Costo, 'US$')
    //   ])
    // }
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
