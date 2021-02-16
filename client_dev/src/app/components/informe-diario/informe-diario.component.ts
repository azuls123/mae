import { Component, OnInit } from '@angular/core';
import { SalvoConductoService } from '../../../services/salvoconducto.service';
import { VehiculoService } from '../../../services/vehiculo.service';

@Component({
  selector: 'app-informe-diario',
  templateUrl: './informe-diario.component.html',
  styleUrls: ['./informe-diario.component.scss'],
  providers: [VehiculoService, SalvoConductoService]
})
export class InformeDiarioComponent implements OnInit {

  public Vehiculos: any[] = [];
  public Vehiculo;
  public Placa;

  public KmRecorrido: number = 0;

  public Salvos: any[] = [];
  public BufferSalvos: any[] = [];

  constructor(
    private _VehiculoService: VehiculoService,
    private _SalvoConductoService: SalvoConductoService
  ) {
    this.loadVehiculos();
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
      this.loadSalvoConductoPorVehiculo(obj);
    } else {
      this.Salvos = [];
    }
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

}
