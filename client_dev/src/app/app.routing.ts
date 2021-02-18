import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';


//modulos internos
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';

import { EstadorecepcionComponent } from './components/estadorecepcion/estadorecepcion.component';
import { FichatecnicaComponent } from './components/fichatecnica/fichatecnica.component';
import { OrdencombustibleComponent } from './components/ordencombustible/ordencombustible.component';
import { OrdentrabajoComponent } from './components/ordentrabajo/ordentrabajo.component';
import { RecorridoComponent } from './components/recorrido/recorrido.component';
import { SalvoconductoComponent } from './components/salvoconducto/salvoconducto.component';
import { TrabajoComponent } from './components/trabajo/trabajo.component';
import { VehiculoComponent } from './components/vehiculo/vehiculo.component';
import { TallerComponent } from './components/taller/taller.component';
import { CombustibleComponent } from './components/combustible/combustible.component';
import { InformeDiarioComponent } from './components/informe-diario/informe-diario.component';
import { IvaComponent } from './components/iva/iva.component';


export const routes: Routes = [
  {
    path: '', 
    component: PagesComponent,
    children:[
      // { path: 'form-elements',  loadChildren: () => import('./pages/form-elements/form-elements.module').then(m => m.FormElementsModule), data: { breadcrumb: 'Form Elements' } },
      // { path: 'profile',        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),                  data: { breadcrumb: 'Profile' }  },         
      { path: 'usuarios' ,        component: UsuarioComponent,    data: { breadcrumb: 'Usuarios' }  },         
      { path: 'empleados',        component: EmpleadoComponent,   data: { breadcrumb: 'Empleados'}  },         
      { path: 'recorrido',        component: RecorridoComponent,   data: { breadcrumb: 'Recorrido'}  },         
      { path: 'vehiculo',         component: VehiculoComponent,   data: { breadcrumb: 'Vehículo'}  },         
      { path: 'trabajo',          component: TrabajoComponent,   data: { breadcrumb: 'Trabajo'}  },         
      { path: 'salvo-conducto',   component: SalvoconductoComponent,   data: { breadcrumb: 'Salvo Conductos y Movilizaciones'}  },         
      { path: 'orden-trabajo',    component: OrdentrabajoComponent,   data: { breadcrumb: 'Orden de Trabajo'}  },         
      // { path: 'ficha-tecnica',    component: FichatecnicaComponent,   data: { breadcrumb: 'Ficha Técnica'}  },         
      { path: 'estado-recepcion', component: EstadorecepcionComponent,   data: { breadcrumb: 'Estado de Recepcion'}  },         
      { path: 'taller',           component: TallerComponent,   data: { breadcrumb: 'Administración de Talleres'}  },         
      { path: 'informe-general',   component: InformeDiarioComponent,   data: { breadcrumb: 'Informe General por Vehículo'}  },         
      { path: 'combustible',   component: CombustibleComponent,   data: { breadcrumb: 'Informe de Repostaje'}  },         
      { path: 'iva',   component: IvaComponent,   data: { breadcrumb: 'Asigación de IVA'}  },         
    ]
  },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: '**', component: NotFoundComponent }
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    // useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }