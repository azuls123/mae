import { Component, OnInit } from '@angular/core';
import { OrdenCombustibleService } from '../../../services/ordenCombustible.service';
import { SalvoConductoService } from '../../../services/salvoconducto.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { UserOptions } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { OrdenTrabajoService } from '../../../services/ordenTrabajo.service';
import { IvaService } from '../../../services/iva.service';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
@Component({
  selector: 'app-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.scss'],
  providers: [VehiculoService, SalvoConductoService, OrdenCombustibleService, OrdenTrabajoService, IvaService, CurrencyPipe, DatePipe, DecimalPipe]
})
export class InformeDiarioComponent implements OnInit {

  public Vehiculos: any[] = [];
  public Vehiculo;
  public Placa;

  public OrdenCombustibles: any[] = [];

  public KmRecorrido: number = 0;

  public Salvos: any[] = [];
  public BufferSalvos: any[] = [];

  public OrdenTrabajos: any[] = [];

  public subtotal;
  public total;
  public subIva;

  public Iva;


  constructor(
    private _VehiculoService: VehiculoService,
    private _SalvoConductoService: SalvoConductoService,
    private _OrdenCombustibleService: OrdenCombustibleService,
    private _OrdenTrabajoService: OrdenTrabajoService,
    private _IvaService: IvaService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe
  ) {
    this.loadVehiculos();
    this._IvaService.IvaActual().subscribe(
      response => {
        this.Iva = response.Iva;
      }
    )
  }
  
  loadSalvoConductoPorVehiculo(vehiculo) {
    let Obj = {
      Vehiculo: vehiculo._id
    }
    this.Salvos = []
    this._SalvoConductoService.Leer(Obj).subscribe(
      response => {
        this.Salvos = response.Salvoconductos;
        this.setKmRecorrido(response.Salvoconductos);
        this.recalcularTotales();
      }
    )
  }
  clearData() {
    
  }
  setKmRecorrido(Salvos) {
    this.KmRecorrido = 0;
    for (const salvo of Salvos) {
      this.KmRecorrido += salvo.Recorrido;
    }
  }
  setVehiculo() {
    this.Vehiculo = null;
    let obj = this.Vehiculos.find(
      vehiculo => 
        vehiculo.Placa == this.Placa
    )
    if (obj) {
      this.Vehiculo = obj;
      this.Salvos = [];
      this.OrdenCombustibles = [];
      this.loadSalvoConductoPorVehiculo(obj);
      this.loadOrdenesCombustible(obj);
      this.loadOrdenTrabajo(obj);
    } else {
      this.Salvos = [];
    }
  }
  
  recalcularTotales() {
    this.subIva = 0;
    this.subtotal = 0;
    this.total = 0;

    if (this.OrdenTrabajos.length >=1) {
      for (const orden of this.OrdenTrabajos) {
        this.total += orden.Total;
      }
    }
    if (this.OrdenCombustibles.length >=1) {
      for (const orden of this.OrdenCombustibles) {
        this.total += orden.Valor;
      }
    }
  this.subIva = (this.total * this.Iva.Valor) / 100;
  this.subtotal = this.total - this.subIva;

  }

  loadOrdenTrabajo(Vehiculo) {
    let query = {
      Vehiculo: Vehiculo._id
    }
    this._OrdenTrabajoService.Leer(query).subscribe(
      response => {
        this.OrdenTrabajos = response.OrdenTrabajos;
        this.recalcularTotales();
      }
    )
  }
  loadOrdenesCombustible(Vehiculo) {
    let query = {
      Vehiculo: Vehiculo._id
    }
    this._OrdenCombustibleService.Leer(query).subscribe(
      response => {
        this.OrdenCombustibles = response.OrdenCombustibles;
        this.recalcularTotales();
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
  ngOnInit() {
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
      416,
      63,
      DateOptions
    );
    const BodyOptions: any = {
      align: 'left'
    }
    let subtitulo = 'Informe General por Vehículo.';
    doc.setFont('Helvetica', '', 'normal');
    doc.setFontSize(11);
    doc.text(subtitulo, 30, 79, BodyOptions);
    let margin: any = {
      bottom: 80,
      top: 80
    };

    doc.setFont('Helvetica', 'bold');
    doc.text('Vehículo: ', 30, 95);
    doc.setFont('Helvetica', 'normal');
    doc.text(this.Vehiculo.Placa + ' - ' + this.Vehiculo.Marca + ' ' + this.Vehiculo.Modelo + ' de ' + this.Vehiculo.Anio, doc.getTextWidth('Vehiculo:??') + 30, 95);

    doc.setFont('Helvetica', 'bold');
    doc.text('Responsable: ', 30, 110);
    doc.setFont('Helvetica', 'normal');
    doc.text(this.Vehiculo.Responsable.Nombres + ' ' + this.Vehiculo.Responsable.Apellidos + ', Con Cédula ' + this.Vehiculo.Responsable.Ci, doc.getTextWidth('Responsable:??') + 30, 110);

    // doc.setFont('Helvetica', 'bold');
    // doc.text('Taller: ', 30, 125);
    // doc.setFont('Helvetica', 'normal');
    // doc.text(orden.Taller.Nombre + ' con RUC: ' + orden.Taller.RUC + ', En la Dirección:  ' + orden.Taller.Direccion, doc.getTextWidth('Taller:??') + 30, 125);

    let body = [];

    if (this.Salvos && this.Salvos.length >=1 ) {
      body.push([
        'No. Salvoconducto',
        'Fecha',
        'Conductor',
        'Kilometraje',
        'Ruta',
        'Estado'
      ]);
      for (const salvo of this.Salvos) {
        body.push([
          salvo.Numero,
          'Salida: ' + this.datePipe.transform(salvo.Fecha.Salida, 'd, MMMM, yyyy h:mm a') + '. Retorno: ' + this.datePipe.transform(salvo.Fecha.Estimada, 'd, MMMM, yyyy h:mm a'),
          salvo.Conductor.Ci + ' - ' + salvo.Conductor.Nombres + ' ' + salvo.Conductor.Apellidos,
          'Inicio: ' + this.decimalPipe.transform(salvo.KmInicial) + ' km. Final: ' + this.decimalPipe.transform(salvo.Recorrido + salvo.KmInicial) + ' km. Recorrido: ' +  salvo.Recorrido + ' km.',
          'Desde: ' + salvo.Lugar.Origen + ', Hasta: ' + salvo.Lugar.Destino,
          salvo.Estado
        ]);
      }
      body.push([
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
    }

    if (this.OrdenCombustibles && this.OrdenCombustibles.length >=1 ) {
      body.push([
        'No.  Ord. Combustible',
        'Fecha',
        'Responsable',
        'Motivo',
        'Cantidad',
        'Costo'
      ]);
      for (const Combustible of this.OrdenCombustibles) {
        body.push([
          Combustible.Numero,
          this.datePipe.transform(Combustible.Fecha, 'd, MMMM, yyyy h:mm a'),
          Combustible.Responsable.Ci + ' - ' + Combustible.Responsable.Nombres + ' ' + Combustible.Responsable.Apellidos,
          Combustible.Motivo,
          this.decimalPipe.transform(Combustible.Cantidad),
          this.currencyPipe.transform(Combustible.Valor)
        ]);
      }
      body.push([
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
    }
    if (this.OrdenTrabajos && this.OrdenTrabajos.length >=1 ) {
      body.push([
        'No.  Ord. Trabajo',
        'Fecha',
        'Solicitante',
        'Taller',
        'Estado',
        'Costo'
      ]);
      for (const orden of this.OrdenTrabajos) {
        body.push([
          orden.Numero,
          this.datePipe.transform(orden.Created.At * 1000, 'd, MMMM, yyyy h:mm a'),
          orden.Solicitante.Ci + ' - ' + orden.Solicitante.Nombres + ' ' + orden.Solicitante.Apellidos,
          orden.Taller.Nombre + ' ' + orden.Taller.RUC,
          orden.Estado,
          this.currencyPipe.transform(orden.Total)
        ]);
      }
      body.push([
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
    }

    body.push([
      '',
      '',
      '',
      '',
      'Subtotal:',
      this.currencyPipe.transform(this.subtotal)
    ]);
    body.push([
      '',
      '',
      '',
      '',
      'Iva:',
      this.currencyPipe.transform(this.subIva)
    ]);
    body.push([
      '',
      '',
      '',
      '',
      'Total:',
      this.currencyPipe.transform(this.total)
    ]);
    // for (const orden of this.OrdenTrabajos) {
    //   body.push([
    //     orden.Numero,
    //     this.datePipe.transform((orden.Created.At * 1000), 'd MMMM yyyy h:mm a'),
    //     orden.Solicitante.Ci + ' - ' + orden.Solicitante.Nombres + ' ' + orden.Solicitante.Apellidos,
    //     orden.Vehiculo.Placa + ' - ' + orden.Vehiculo.Marca + ' ' + orden.Vehiculo.Modelo,
    //     orden.Taller.Nombre + ' ' + orden.Taller.RUC,
    //     orden.Estado
    //   ])
    // }
    doc.autoTable({
      // head: [['No.', 'Fecha', 'Solicitante', 'Vehículo', 'Taller', 'Estado']],
      body: body,
      startY: 125,
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
