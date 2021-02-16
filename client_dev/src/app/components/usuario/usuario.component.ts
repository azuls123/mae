import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioModel } from '../../../models/usuario.model';
import { EmpleadoModel } from '../../../models/empleado.model';
import { EmpleadoService } from '../../../services/empleado.service';
import { stringify } from '@angular/compiler/src/util';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { CurrencyPipe, DatePipe } from '@angular/common';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [UsuarioService, EmpleadoService, CurrencyPipe, DatePipe]
})
export class UsuarioComponent implements OnInit {
  public newUsuario: UsuarioModel;
  public NewEmpleado: EmpleadoModel;
  public Empleados: any[] = [];
  public BufferEmpleados: any[] = [];
  public SelectedEmpleado;
  public isNew: boolean = true;
  public paginationDataEmpleados = {
    id: 'Empleados_tbl',
    itemsPerPage: 5,
    currentPage: 1
  }
  public paginationDataUsuarios = {
    id: 'Usuarios_tbl',
    itemsPerPage: 10,
    currentPage: 1
  }
  public newPassword = {
    Contrase: '',
    Confirmar: null
  }
  public Usuarios;
  public BufferUsuarios;

  public viewedUsuario;

  constructor(
    private _UsuarioService: UsuarioService,
    private _empleadoService: EmpleadoService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    this.initNewUsuario();
    this.loadEmpleados();
    this.initEmpleado();
    this.loadUsuarios();
  }
  loadUsuarios() {
    this._UsuarioService.Leer().subscribe(
      response => {
        // console.log(response);
        this.Usuarios = response.Usuarios;
        this.BufferUsuarios = response.Usuarios;
      }
    )
  }
  initPassword() {
    this.newPassword = {
      Contrase: '',
      Confirmar: null
    }
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
  initNewUsuario() {
    this.newUsuario = {
      _id: '',
      Correo: '',
      Contrase: '',
      Empleado: '',
      Activo: true
    }
  }
  initEmpleado() {
    this.NewEmpleado = {
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
    if (this.NewEmpleado._id) {
      (this.newUsuario._id) ? this.onUpdateUser() : this.onCreateUser();
    } else {
      this._empleadoService.Crear(this.NewEmpleado).subscribe(
        response => {
          this.newUsuario.Empleado = response.Empleado._id;
          this.NewEmpleado = response.Empleado;
          (this.newUsuario._id) ? this.onUpdateUser() : this.onCreateUser();
        }
      )
    }
  }
  onCreateUser() {
    console.log('Creando');
    this._UsuarioService.Crear(this.newUsuario).subscribe(
      response => {
        console.log(response);
        this.loadUsuarios();
        this.initNewUsuario();
        this.initEmpleado();
      }
    )
  }
  onUpdateUser() {
    this._UsuarioService.Editar(this.newUsuario).subscribe(
      response => {
        console.log(response);
        this.loadUsuarios();
        this.initNewUsuario();
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
            // termino = apellidos + nombres + telefono + cedula + area + cargo;
            termino = apellidos + nombres + cedula + area;
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

  //filtros
  public typeUsuario: string = 'todo';
  public searchTitleUsuario: string = 'Buscando Todo';
  public searchTextUsuario: string;
  defineUsuario() {
    this.Usuarios = [];
    if (this.searchTextUsuario !== '' && this.searchTextUsuario != undefined) {
      for (const usuario of this.BufferUsuarios) {
        const cedula = usuario.Empleado.Ci.toLowerCase().replace(/[^\w]/gi, '');
        const nombres = usuario.Empleado.Nombres.toLowerCase().replace(/[^\w]/gi, '');
        const apellidos = usuario.Empleado.Apellidos.toLowerCase().replace(/[^\w]/gi, '');
        const area = usuario.Empleado.Area.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = usuario.Empleado.Telefono.toLowerCase().replace(/[^\w]/gi, '');
        const cargo = usuario.Empleado.Cargo.toLowerCase().replace(/[^\w]/gi, '');
        const correo = usuario.Correo.toLowerCase().replace(/[^\w]/gi, '');
        let termino = '';
        switch (this.typeUsuario) {
          case 'nombres':
            this.searchTitleUsuario = 'Buscando Nombres';
            termino = nombres;
            break;
          case 'apellidos':
            this.searchTitleUsuario = 'Buscando Apellidos...';
            termino = apellidos;
            break;
          case 'telefono':
            this.searchTitleUsuario = 'Buscando Teléfono...';
            termino = telefono;
            break;
          case 'area':
            this.searchTitleUsuario = 'Buscando Area...';
            termino = area;
            break;
          case 'cargo':
            this.searchTitleUsuario = 'Buscando Cargo...';
            termino = cargo;
            break;
          case 'correo':
            this.searchTitleUsuario = 'Buscando Correo Electrónico...';
            termino = correo;
            break;
          case 'cedula':
            this.searchTitleUsuario = 'Buscando Cédula...';
            termino = cedula;
            break;
          case 'todo':
            this.searchTitleUsuario = 'Buscando Todo';
            termino = apellidos + nombres + telefono + cedula + area + cargo + correo;
            // termino = apellidos + nombres  + cedula + area ;
            break;
        }
        // console.log(termino);

        if (termino.indexOf(this.searchTextUsuario.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Usuarios.push(usuario)
        }
      }
    } else {
      this.Usuarios = this.BufferUsuarios;
      switch (this.typeUsuario) {
        case 'nombres':
          this.searchTitleUsuario = 'Buscando Nombres';
          break;
        case 'apellidos':
          this.searchTitleUsuario = 'Buscando Apellidos...';
          break;
        case 'telefono':
          this.searchTitleUsuario = 'Buscando Teléfono...';
          break;
        case 'area':
          this.searchTitleUsuario = 'Buscando Area...';
          break;
        case 'cargo':
          this.searchTitleUsuario = 'Buscando Cargo...';
          break;
        case 'correo':
          this.searchTitleUsuario = 'Buscando Correo Electrónico...';
          break;
        case 'cedula':
          this.searchTitleUsuario = 'Buscando Cédula...';
          break;
        case 'todo':
          this.searchTitleUsuario = 'Buscando Todo';
          break;
      }
    }
  }
  toDelete(usuario) {
    usuario.Activo = !usuario.Activo;
    this._UsuarioService.Editar(usuario).subscribe(
      response => {
        this.loadUsuarios();
      }
    )
  }
  setNewPassword() {
    // console.log(this.newPassword);
    this._UsuarioService.CambiarContrase(this.newUsuario._id, this.newPassword).subscribe(
      response => {
        // console.log(response);
      }
    )
  }
  getPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let fecha = new Date();
    let Nombre = "Usuarios_H" + fecha.getHours() + "_" + fecha.getMinutes() + "_" + fecha.getSeconds() + "_F" + fecha.getDate() + "_" + (fecha.getMonth() + 1) + "_" + fecha.getFullYear();
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

    for (const usuario of this.Usuarios) {
      body.push([
        usuario.Correo, usuario.Empleado.Ci, usuario.Empleado.Nombres + ' ' + usuario.Empleado.Apellidos, usuario.Empleado.Cargo,  usuario.Empleado.Telefono, this.datePipe.transform((usuario.Created.At * 1000), 'd, MMMM, yyyy. h:mm a')
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
    let subtitulo = 'Informe de Usuarios: ';
    if (this.searchTextUsuario && this.searchTextUsuario != '') {
      subtitulo = subtitulo + ' ' + this.searchTitleUsuario + ', que contenga: "' + this.searchTextUsuario + '".';
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
      head: [['Correo Electrónico','Cédula', 'Nombres', 'Cargo', 'Teléfono', 'Ingreso']],
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
