import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/usuario/';

    public signIn(userData: Usuario): Observable<any> {
        return this.http.post<any>(this.baseUrl + `validar`, userData);
    }

    public getUserByToken(token: string): Observable<Usuario> {
        return this.http.get<Usuario>(this.baseUrl + `?token=${token}`);
    }

    public getUsuarios(all: boolean = false): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.baseUrl + `?all=${all}`);
    }

    public getUsuarioById(idUsuario: number): Observable<Usuario> {
        return this.http.get<Usuario>(this.baseUrl + `${idUsuario}`);
    }

    public guardarUsuario(usuario: Usuario): Observable<any> {
        return this.http.post<any>(this.baseUrl, usuario, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarUsuario(usuario: Usuario): Observable<any> {
        return this.http.put<any>(this.baseUrl, usuario);
    }

    public eliminarUsuario(idUsuario: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idUsuario}`);
    }
}
