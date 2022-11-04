import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Rol} from '../models/rol';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RolService {
    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/rol/';

    public buscarRoles(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getRoles(all: boolean = false): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.baseUrl + `?all=${all}`);
    }

    public getRolById(idRol: number): Observable<Rol> {
        return this.http.get<Rol>(this.baseUrl + `${idRol}`);
    }

    public guardarRol(rol: Rol): Observable<any> {
        return this.http.post<any>(this.baseUrl, rol, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarRol(rol: Rol): Observable<any> {
        return this.http.put<any>(this.baseUrl, rol);
    }

    public eliminarRol(idRol: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idRol}`);
    }
}
