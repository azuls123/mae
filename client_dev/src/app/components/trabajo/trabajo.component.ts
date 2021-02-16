import { Component, OnInit } from "@angular/core";
import { TrabajoService } from "../../../services/trabajo.service";
import { TrabajoModel } from "../../../models/trabajo.model";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { CurrencyPipe, DatePipe } from '@angular/common';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: "app-trabajo",
  templateUrl: "./trabajo.component.html",
  styleUrls: ["./trabajo.component.scss"],
  providers: [TrabajoService, CurrencyPipe, DatePipe],
})
export class TrabajoComponent implements OnInit {
  public NewTrabajo: TrabajoModel;

  public Trabajos: any[] = [];
  public BufferTrabajos: any[] = [];

  public viewedTrabajo;
  
  //filtros
  public typeTrabajo: string = 'todo';
  public searchTitleTrabajo: string = 'Buscando Todo';
  public searchTextTrabajo: string = '';

  constructor(private _TrabajoService: TrabajoService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe) {
    this.initNewTrabajo();
    this.loadTrabajos();
  }

  toDelete(Obj) {
    Obj.Activo = !Obj.Activo;
    this._TrabajoService.Editar(Obj).subscribe(
      response => {
        this.loadTrabajos();
      }
    )
  }

  initNewTrabajo() {
    this.NewTrabajo = {
      _id: "",
      Tipo: "",
      Descripcion: "",
      Activo: true
    };
  }

  clearData() {
    this.initNewTrabajo();
  }

  onSubmit() {
    (this.NewTrabajo && this.NewTrabajo._id) ? this.onUpdate(): this.onSave();
  }

  onSave() {
    this._TrabajoService.Crear(this.NewTrabajo).subscribe(
      response => {
        this.initNewTrabajo();
        this.loadTrabajos();
      }
    )
  }
  
  onUpdate() {
    this._TrabajoService.Editar(this.NewTrabajo).subscribe(
      response => {
        this.initNewTrabajo();
        this.loadTrabajos();
      }
    );
  }

  loadTrabajos() {
    this._TrabajoService.Leer().subscribe(
    response => {
      // console.log(response as any);
      this.Trabajos = response.Trabajos;
      this.BufferTrabajos = response.Trabajos;
    }, error => {
      // console.log(error as any);
    });
  }

  ngOnInit(): void {}

  setRaw(Str: string): string {
    let Raw = '';
    Raw = Str.replace(/[^\w]/gi, '').toLowerCase();
    return Raw
  }

  defineTrabajo() {
    this.Trabajos = [];
    if (this.searchTextTrabajo !== '' && this.searchTextTrabajo != undefined) {
      for (const trabajo of this.BufferTrabajos) {
        const descripcion = this.setRaw(trabajo.Descripcion);
        const tipo = this.setRaw(trabajo.Tipo);
        console.log(descripcion);
        let termino = '';
        switch (this.typeTrabajo) {
          case 'tipo':
            this.searchTitleTrabajo = 'Buscando Tipo';
            termino = tipo;
            break;
          case 'descripcion':
            this.searchTitleTrabajo = 'Buscando Descripción';
            termino = descripcion;
            break;
          case 'todo':
            this.searchTitleTrabajo = 'Buscando Todo';
            termino = tipo + descripcion;
            break;
        }
        if (termino.indexOf(this.searchTextTrabajo.toLowerCase().replace(/[^\w]/gi, '')) > -1) {
          this.Trabajos.push(trabajo);
        }
      }
    } else {
      this.Trabajos = this.BufferTrabajos;
      switch (this.typeTrabajo) {
        case 'tipo':
          this.searchTitleTrabajo = 'Buscando Tipo';
          break;
        case 'descripcion':
          this.searchTitleTrabajo = 'Buscando Descripción';
          break;
        case 'todo':
          this.searchTitleTrabajo = 'Buscando Todo';
          break;
      }
    }
  }

  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "Trabajos_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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

    for (const Trabajo of this.Trabajos) {
      body.push([
        Trabajo.Tipo, Trabajo.Descripcion, Trabajo.Created.By.Empleado.Ci +' - ' +Trabajo.Created.By.Empleado.Nombres + ' ' + Trabajo.Created.By.Empleado.Apellidos + ', ' + Trabajo.Created.By.Empleado.Cargo, this.datePipe.transform((Trabajo.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
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
    let subtitulo = 'Informe de Trabajos: ';
    if (this.searchTextTrabajo && this.searchTextTrabajo != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleTrabajo + ', que contenga: "' + this.searchTextTrabajo + '".';
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
      head: [['Tipo de trabajo', 'Nombre del trabajo', 'Creado por', 'Ingreso']],
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
