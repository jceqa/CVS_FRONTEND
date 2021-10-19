import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UsuarioRolService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = "api/usuariorol/";

    public getRolesByUserId(userId: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/usuario/id?id_usuario=${userId}`)
    }
}