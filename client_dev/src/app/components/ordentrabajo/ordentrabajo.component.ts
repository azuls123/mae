import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';
import { TallerService } from '../../../services/taller.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { TrabajoService } from '../../../services/trabajo.service';
import { OrdenTrabajoService } from '../../../services/ordenTrabajo.service';
import { TrabajoOrdenService } from '../../../services/trabajoOrden.service';
import { OrdenTrabajoModel } from '../../../models/ordenTrabajo.model';

@Component({
  selector: 'app-ordentrabajo',
  templateUrl: './ordentrabajo.component.html',
  styleUrls: ['./ordentrabajo.component.scss'],
  providers: [VehiculoService, EmpleadoService, TallerService, TrabajoService, OrdenTrabajoService, TrabajoOrdenService]
})
export class OrdentrabajoComponent implements OnInit {

  public Vehiculos: any[] = [];
  public Empleados: any[] = [];
  public Talleres: any[] = [];
  public viewedVehiculo: any;
  public viewedSolicitante: any;
  public viewedTaller: any;
  public Trabajos: any[] = [];

  public tipoTrabajos:any[] = [];

  public SelectedTrabajos: any[] = [
  ];
  public newOrdenTrabajo: OrdenTrabajoModel;

  public viewedOrdenTrabajo: any;
  public viewedTrabajos: any;

  public OrdenTrabajos: any[] = [];
  public BufferOrdenTrabajos: any[] = [];


  public paginationDataOrdenTrabajo = {
    id: 'OrdenTrabajo',
    itemsPerPage: 7,
    currentPage: 1
  }

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
    private _TrabajoOrdenService: TrabajoOrdenService
  ) {
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
    this.newOrdenTrabajo = {
      _id: '',
      Vehiculo: '',
      Solicitante: '',
      Taller: '',
      Numero: 0
    };
  }

  initSelectedTrabajos() {
    this.SelectedTrabajos = [];
    this.addNewTrabajo();
  }

  addNewTrabajo() {
    this.SelectedTrabajos.push(
      {
        _id: '',
        Trabajo: '',
        Detalles: '',
        Orden: ''
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
    for (const trabajo of  this.SelectedTrabajos) {
      console.log(trabajo);
      
    }
    if (!(this.SelectedTrabajos.find(trabajo => trabajo.trabajo == id))) {
      check = true;
      console.log('unico');
    } else {
      console.log('no-unico');
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
            + orden.Taller.RUC.toLowerCase().replace(/[^\w]/gi, '');
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
          case 'todo':
            this.searchTitleOrdenTrabajo = 'Buscando Todo';
            termino = taller + solicitante + vehiculo;
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
        case 'todo':
          this.searchTitleOrdenTrabajo = 'Buscando Todo';
          break;
      }
    }

  }

}
