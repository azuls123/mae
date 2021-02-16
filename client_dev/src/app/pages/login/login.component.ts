import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidators } from 'ngx-validators'
import { UsuarioService } from '../../../services/usuario.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UsuarioService]
})
export class LoginComponent {
  public router: Router;
  public form: FormGroup;
  public Correo: AbstractControl;
  public Contrase: AbstractControl;
  public isOn: boolean = true;
  public Message = {
    status: null,
    Message: null,
    Title: null
  }

  constructor(router: Router, fb: FormBuilder, private _UsuarioService: UsuarioService, private _location: Location) {
    this.router = router;
    (localStorage.getItem('Identity') != undefined && localStorage.getItem('Identity') != '' && localStorage.getItem('Token') != undefined && localStorage.getItem('Token') != '') ? this._location.back() : this.isOn = false;
    
    this.form = fb.group({
      'Correo': ['', Validators.compose([Validators.required, EmailValidators.normal])],
      'Contrase': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.Correo = this.form.controls['Correo'];
    this.Contrase = this.form.controls['Contrase'];
  }

  public onSubmit(values: Object): void {
    if (this.form.valid) {
      this._UsuarioService.Login(values).subscribe(
        response => {
          // console.log(response);
          // this.alert = null;
          // (response.Token) ? Config.Token = response.Token : Config.Token = 'No Token';
          // console.log(response as any);
          this.Message.status = 200
          this.Message.Message = response.Message
          this.Message.Title = response.Title
          localStorage.setItem('Identity', JSON.stringify(response.Usuario));
          localStorage.setItem('Token', response.Token);
          this.router.navigate(['/']);
          // window.location.reload();
        },
        error => {
          console.log(error);
          this.Message.status = error.status
          this.Message.Message = error.error.Message
          this.Message.Title = error.error.Title
          // console.error(error as any);
          // (error.status === 404) ? this.alert = 'No se encuentra la Cuenta, intentelo nuevamente' : this.alert = error.error.Message;
        }
      )
      //   this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

}
