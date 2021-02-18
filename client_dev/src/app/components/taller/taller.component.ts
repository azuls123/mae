import { Component, OnInit } from "@angular/core";

import { TallerModel } from "../../../models/taller.model";
import { TallerService } from "../../../services/taller.service";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { CurrencyPipe, DatePipe } from '@angular/common';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: "app-taller",
  templateUrl: "./taller.component.html",
  styleUrls: ["./taller.component.scss"],
  providers: [TallerService, CurrencyPipe, DatePipe],
})
export class TallerComponent implements OnInit {
  public newTaller: TallerModel;
  public Talleres: any[] = [];
  public BufferTalleres: any[] = [];
  public paginationDataTalleres = {
    id: 'talleres_tbl',
    itemsPerPage: 5,
    currentPage: 1
  }
  public viewedTaller;
  public isUser: boolean = false;
  constructor(private _TallerService: TallerService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe) {
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
    this.initNewTaller();
    this.loadTalleres();
  }

  loadTalleres() {
    this._TallerService.Leer().subscribe(
      (response) => {
        this.Talleres = response.Talleres;
        this.BufferTalleres = response.Talleres;
      },
      (error) => {
        console.log(error as any);
      }
    );
  }
  initNewTaller() {
    this.newTaller = {
      _id: "",
      RUC: "",
      Nombre: "",
      Direccion: "",
      Activo: true,
    };
  }

  onSubmit() {
    this.newTaller._id ? this.onUpdate() : this.onCreate();
  }

  onUpdate() {
    // console.log(this.newTaller);
    this._TallerService.Editar(this.newTaller).subscribe((response) => {
      console.log(response);
      this.initNewTaller();
      this.loadTalleres();
    });
  }

  onCreate() {
    // console.log(this.newTaller);
    this._TallerService.Crear(this.newTaller).subscribe((response) => {
      console.log(response);
      this.initNewTaller();
      this.loadTalleres();
    });
  }

  ngOnInit() {}

  public typeTaller: string = "Todo";
  public searchTitleTaller: string = "Buscando todo";
  public searchTextTaller: string;

  defineTaller() {
    this.Talleres = [];
    if (this.searchTextTaller !== "" && this.searchTextTaller != undefined) {
      for (const taller of this.BufferTalleres) {
        const ruc = taller.ruc;
        const nombre = taller.Nombre.toLowerCase().replace(/'[]'/gi, "");
        const direccion = taller.Direccion.toLowerCase().replace(/'[]'/gi, "");
        let termino = '';
        switch (this.typeTaller) {
          case "ruc":
            this.searchTitleTaller = "Buscar RUC";
            termino = ruc;
            break;
          case "nombre":
            this.searchTitleTaller = "Buscar Nombre";
            termino = nombre;
          
            break;
          case "direccion":
            this.searchTitleTaller = "Buscar Dirección";
            termino = direccion;

            break;
          case "todo":
            this.searchTitleTaller = "Buscando todo";
            termino = direccion + nombre + ruc;
            break;
        }
        if (termino.indexOf(this.searchTextTaller.toLowerCase().replace(/' '/gi, ''))> -1) this.Talleres.push(taller);
      }
    } else {
      this.Talleres = this.BufferTalleres;
      
      switch (this.typeTaller) {
        case "ruc":
          this.searchTitleTaller = "Buscar RUC";
          break;
        case "nombre":
          this.searchTitleTaller = "Buscar Nombre";
          break;
        case "direccion":
          this.searchTitleTaller = "Buscar Dirección";
          break;
        case "todo":
          this.searchTitleTaller = "Buscando todo";
          break;
      }
    }
  }
  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "Talleres_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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
    let body = [];

    for (const taller of this.Talleres) {
      body.push([
        taller.RUC, taller.Nombre, taller.Direccion, this.datePipe.transform((taller.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
        // ''+vehiculo.Marca, ''+vehiculo.Modelo, ''+vehiculo.Anio, ''+vehiculo.Placa, ''+vehiculo.Matricula, this.currencyPipe.transform(vehiculo.Costo, 'US$')
      ])
    }

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
    let subtitulo = 'Informe de Talleres: ';
    if (this.searchTextTaller && this.searchTextTaller != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleTaller + ', que contenga: "' + this.searchTextTaller + '".';
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
    doc.autoTable({
      head: [['Razón Social', 'Nombre del Taller', 'Dirección', 'Ingreso']],
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
