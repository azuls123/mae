import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService, UsuarioService ],
  animations: [
    trigger('showInfo', [
      state('1' , style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu:boolean = true; 
  public showInfoContent:boolean = false;
  public settings: Settings;
  public menuItems:Array<any>;

  public form:FormGroup;
  public Anterior:AbstractControl;
  public Contrase:AbstractControl;
  public Confirmar:AbstractControl;

  public identity:any = JSON.parse(localStorage.getItem('Identity'));
  constructor(
    public appSettings:AppSettings, 
    public menuService:MenuService, 
    fb: FormBuilder,
    public Router:Router,
    private _UsuarioService: UsuarioService) {
      this.settings = this.appSettings.settings;
      this.menuItems = this.menuService.getHorizontalMenuItems();

      this.form = fb.group({
        Anterior : ['', Validators.compose([Validators.required, PasswordValidator])],
        Contrase : ['', Validators.required],
        Confirmar: ['', Validators.required]
      }, { validator: matchingPasswords('Contrase', 'Confirmar') });
      this.Anterior = this.form.controls['Anterior'];
      this.Contrase = this.form.controls['Contrase'];
      this.Confirmar = this.form.controls['Confirmar'];
  }
  
  ngOnInit() {
    if(window.innerWidth <= 768) 
      this.showHorizontalMenu = false;
  }


  public closeSubMenus(){
    let menu = document.querySelector("#menu0"); 
    if(menu){
      for (let i = 0; i < menu.children.length; i++) {
          let child = menu.children[i].children[1];
          if(child){          
              if(child.classList.contains('show')){            
                child.classList.remove('show');
                menu.children[i].children[0].classList.add('collapsed'); 
              }             
          }
      }
    }
  }

  @HostListener('window:resize')
  public onWindowResize():void {
     if(window.innerWidth <= 768){
        this.showHorizontalMenu = false;
     }      
      else{
        this.showHorizontalMenu = true;
      }
  }
  logout(){
    localStorage.clear();
    this.Router.navigate(["/login"]);
  }
  changePassword(values: any) {
    if (this.form.valid) {
      const cambioContrase = {
        Anterior : values.Anterior,
        Contrase : values.Contrase,
        Confirmar: values.Confirmar,
        _id: this.identity._id
      };
      this._UsuarioService.CambiarMiContrase(cambioContrase).subscribe(
        response => {
          // console.log(response);
          this.form.reset();
        }, error => {
          console.log(error as any);
          
        }
      )

    }
  }
}
export function PasswordValidator(control: FormControl): { [key: string]: any } {
  var passRegexp = /[^\n]{6,}/;
  if (control.value && !passRegexp.test(control.value)) return { shortPassword: true }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
      let password = group.controls[passwordKey];
      let passwordConfirmation = group.controls[passwordConfirmationKey];
      if (password.value !== passwordConfirmation.value) {
          return passwordConfirmation.setErrors({ mismatchedPasswords: true })
      }
  }
}