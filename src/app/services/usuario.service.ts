import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = "api/usuario/";

    public signIn(userData: Usuario): Observable<any> {
        return this.http.post<any>(this.baseUrl + `validar`, userData)
    }

    public getUserByToken(token: string): Observable<Usuario> {
        return this.http.get<Usuario>(this.baseUrl + `?token=${token}`)
    }
}