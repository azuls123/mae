import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './global.service';

@Injectable()
export class TrabajoService {
  public url : string;
  public Token : string;

  constructor(public _Http : HttpClient) {
    this.url = Config.Url + 'trabajo/';
    this.Token = localStorage.getItem('Token');
}
Crear(Object) : Observable<any> {
    const params = JSON.stringify(Object);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Authorization', this.Token);

    return this._Http.post(this.url + 'crear', params, {headers});
}
Leer(Obj = null) : Observable<any> {
    const ObjStr = JSON.stringify(Obj);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Authorization', this.Token);
    return this._Http.post(this.url + 'leer', Obj, {headers});
}
Editar(Object) : Observable<any> {
    const params = JSON.stringify(Object);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Authorization', this.Token);

    return this._Http.put(this.url + 'editar/' + Object._id, params, {headers});
}
// test(): Observable<any> {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json')
//     return this._Http.get(Config.Url + 'test/', {headers});
// }
}