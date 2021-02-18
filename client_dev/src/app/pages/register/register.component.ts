import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from '../../../services/empleado.service';
import { UsuarioService } from '../../../services/usuario.service';
import { EmpleadoModel } from '../../../models/empleado.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { Location } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [EmpleadoService, UsuarioService]
})
export class RegisterComponent {
    public router: Router;
    public form: FormGroup;
    public Ci: AbstractControl;
    public Nombres: AbstractControl;
    public Apellidos: AbstractControl;
    public Telefono: AbstractControl;
    public Correo: AbstractControl;
    public Contrase: AbstractControl;
    public ConfirmContrase: AbstractControl;

    public isOn: boolean = true;

    public registerEmpleado: EmpleadoModel;
    public registerUsuario: UsuarioModel;

    constructor(
        router: Router,
        fb: FormBuilder,
        private _UsuarioService: UsuarioService,
        private _EmpleadoService: EmpleadoService,
        private _location: Location
    ) {
        (localStorage.getItem('Identity') != undefined && localStorage.getItem('Identity') != '' && localStorage.getItem('Token') != undefined && localStorage.getItem('Token') != '') ? this._location.back() : this.isOn = false;

        this.router = router;
        this.form = fb.group({
            Ci: ['', Validators.compose([Validators.required, CiValidator])],
            Telefono: ['', Validators.compose([Validators.required, PhoneValidator])],
            Nombres: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            Apellidos: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            Correo: ['', Validators.compose([Validators.required, emailValidator])],
            Contrase: ['', Validators.required],
            ConfirmContrase: ['', Validators.required]
        }, { validator: matchingPasswords('Contrase', 'ConfirmContrase') });

        this.Ci = this.form.controls['Ci'];
        this.Telefono = this.form.controls['Telefono'];
        this.Nombres = this.form.controls['Nombres'];
        this.Apellidos = this.form.controls['Apellidos'];
        this.Correo = this.form.controls['Correo'];
        this.Contrase = this.form.controls['Contrase'];
        this.ConfirmContrase = this.form.controls['ConfirmContrase'];
    }
    public onSubmit(values: any): void {
        if (this.form.valid) {
            // console.log(values.Nombres);
            this.registerEmpleado = {
                _id: '',
                Activo: true,
                Apellidos: values.Apellidos,
                Area: 'Fuera del Departamento',
                Cargo: 'Visitante',
                Ci: values.Ci,
                Nombres: values.Nombres,
                Telefono: values.Telefono
            }
            this._EmpleadoService.Crear(this.registerEmpleado).subscribe(
                response => {
                    this.registerUsuario = {
                        Activo: true,
                        Contrase: values.Contrase,
                        Correo: values.Correo,
                        Empleado: response.Empleado._id,
                        _id: ''
                    }
                    this._UsuarioService.Crear(this.registerUsuario).subscribe(
                        response => {
                            this.router.navigate(['/login']);
                        }
                    )
                }
            )
        }
    }

    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }
}

export function CiValidator(control: FormControl): { [key: string]: any } {
    var ciRegexp = /[0-9]{10}/;
    if (control.value && !ciRegexp.test(control.value)) return { invalidCi: true }
}
export function PhoneValidator(control: FormControl): { [key: string]: any } {
    var PhoneRegexp = /[0-9]{9,13}/;
    if (control.value && !PhoneRegexp.test(control.value)) return { invalidPhone: true }
}

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
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
