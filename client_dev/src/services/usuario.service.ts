import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './global.service';

@Injectable()
export class UsuarioService{
    public url : string;
    public Token : string;
    constructor(public _Http : HttpClient) {
        this.url = Config.Url + 'usuario/';
        this.Token = localStorage.getItem('Token');
    }
    Crear(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        if (this.Token) {
            headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.Token);
        }

        return this._Http.post(this.url + 'crear', params, {headers});
    }
    Login(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        // .set('Authorization', this.Token);

        return this._Http.post(this.url + 'login', params, {headers});
    }
    Leer() : Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);
        return this._Http.get(this.url + 'leer', {headers});
    }
    LeerTipo(Tipo) : Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);
        return this._Http.get(this.url + 'leer/'+Tipo, {headers});
    }
    Editar(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'editar/' + Object._id, params, {headers});
    }
    CambiarContrase(id, Object) : Observable<any> {
        const params = JSON.stringify(Object);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'cambiar-contrase/' + id, params, {headers});
    }
    
    CambiarMiContrase(Object) : Observable<any> {
        const params = JSON.stringify(Object);
        // objeto de be contener Anterior, Contrase y Confirmar
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.Token);

        return this._Http.put(this.url + 'cambiar-mi-contrase', params, {headers});
    }
    // test(): Observable<any> {
    //     const headers = new HttpHeaders().set('Content-Type', 'application/json')
    //     return this._Http.get(Config.Url + 'test/', {headers});
    // }
}