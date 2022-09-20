import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRol } from '../models/usuarioRol';

@Injectable({
    providedIn: 'root'
})

export class UsuarioRolService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = 'api/usuariorol/';

    public getByUserId(userId: number): Observable<UsuarioRol[]> {
        return this.http.get<UsuarioRol[]>(this.baseUrl + `${userId}`);
    }
}
