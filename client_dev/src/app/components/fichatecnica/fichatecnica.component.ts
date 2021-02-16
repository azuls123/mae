import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../../services/empleado.service';
import { OrdenTrabajoService } from '../../../services/ordenTrabajo.service';
import { TrabajoOrdenService } from '../../../services/trabajoOrden.service';

@Component({
  selector: 'app-fichatecnica',
  templateUrl: './fichatecnica.component.html',
  styleUrls: ['./fichatecnica.component.scss'],
  providers: [EmpleadoService, OrdenTrabajoService, TrabajoOrdenService]
})
export class FichatecnicaComponent implements OnInit {

  public viewedConductor: any;

  public viewedOrdenTrabajo: any;
  public viewedTrabajoOrdenes: any []= [];

  public trabajos: any[] = [];

  public Conductores;

  constructor(
    private _EmpleadoService: EmpleadoService,
    private _OrdenTrabajoService: OrdenTrabajoService,
    private _TrabajoOrdenService: TrabajoOrdenService
  ) {
    this.loadConductores();
  }

  loadConductores() {
    this._EmpleadoService.LeerCargo('Conductor').subscribe(
      response => {
        this.Conductores = response.Empleados;
      }
    )
  }

  ngOnInit(): void {
  }

  setConductor(Ci: string): any {
    let obj = this.Conductores.find(conductor => conductor.Ci == Ci);
    return obj;
  }

  setOrden(Numero: any) {
    this._OrdenTrabajoService.Leer({ Numero: Numero }).subscribe(
      response => {
        console.log(response);
        this.viewedOrdenTrabajo = response.OrdenTrabajos[0];
        if (this.viewedOrdenTrabajo && this.viewedOrdenTrabajo._id) {
          this._TrabajoOrdenService.Leer({Orden: this.viewedOrdenTrabajo._id}).subscribe(
            response => {
              this.viewedTrabajoOrdenes = [];
              for (const trabajo of response.TrabajoOrdenes) {
                let trabajoFicha = trabajo;
                trabajoFicha.Operacion = '';
                trabajoFicha.UT = 0;
                this.viewedTrabajoOrdenes.push(trabajoFicha);
              }
              // this.viewedTrabajoOrdenes = 
            }
          )
        }
      }
    )
  }

}
