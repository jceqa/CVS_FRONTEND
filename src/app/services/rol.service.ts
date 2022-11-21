import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {RolPermiso} from '../models/rolPermiso';

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

    public getRoles(all: boolean = false): Observable<RolPermiso[]> {
        return this.http.get<RolPermiso[]>(this.baseUrl + `?all=${all}`);
    }

    public getRolById(idRol: number): Observable<RolPermiso> {
        return this.http.get<RolPermiso>(this.baseUrl + `${idRol}`);
    }

    public guardarRol(rolPermiso: RolPermiso): Observable<any> {
        return this.http.post<any>(this.baseUrl, rolPermiso, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarRol(rolPermiso: RolPermiso): Observable<any> {
        return this.http.put<any>(this.baseUrl, rolPermiso);
    }

    public eliminarRol(idRol: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idRol}`);
    }
}
