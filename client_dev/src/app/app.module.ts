import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import * as tslib_1 from 'tslib';
import * as date_fns_2 from 'date-fns'; 
function adapterFactory() {
  return tslib_1.__assign(tslib_1.__assign({}),date_fns_2);
}

import { MomentModule } from 'angular2-moment';

import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { PipesModule } from './theme/pipes/pipes.module';

import { AppRoutingModule } from './app.routing';
import { AppSettings } from './app.settings';

import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './theme/components/header/header.component';
import { FooterComponent } from './theme/components/footer/footer.component';
import { SidebarComponent } from './theme/components/sidebar/sidebar.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from './theme/components/back-top/back-top.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { SideChatComponent } from './theme/components/side-chat/side-chat.component';
import { FavoritesComponent } from './theme/components/favorites/favorites.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { CommonModule, registerLocaleData } from '@angular/common';
 
import { CKEditorModule } from 'ng2-ckeditor';
import { DirectivesModule } from './theme/directives/directives.module';
import { DragulaModule } from 'ng2-dragula';


import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');
// Modulos Internos

import {NgxPaginationModule} from 'ngx-pagination';

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
import { CombustibleComponent } from './components/combustible/combustible.component';
import { IvaComponent } from './components/iva/iva.component';

import { TallerComponent } from './components/taller/taller.component';
import { InformeDiarioComponent } from './components/informe-diario/informe-diario.component';

@NgModule({  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    PerfectScrollbarModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    MultiselectDropdownModule,
    MomentModule,
    // NgxMaskModule,
    NgxPaginationModule,
    HttpClientModule,
    CKEditorModule,
    DirectivesModule,
    DragulaModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA1rF9bttCxRmsNdZYjW7FzIoyrul5jb-s'
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot(), 
    PipesModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    BackTopComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FlagsMenuComponent,
    SideChatComponent,
    FavoritesComponent,
    BlankComponent,
    SearchComponent,
    NotFoundComponent,
    UsuarioComponent, 
    EmpleadoComponent, 
    EstadorecepcionComponent, 
    FichatecnicaComponent, 
    OrdencombustibleComponent, 
    OrdentrabajoComponent, 
    RecorridoComponent, 
    SalvoconductoComponent, 
    TrabajoComponent, 
    VehiculoComponent,
    TallerComponent,
    InformeDiarioComponent,
    CombustibleComponent,
    IvaComponent
  ],
  providers: [ 
    AppSettings,
    { provide: LOCALE_ID, useValue : 'es' },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { } 