import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Permiso} from '../models/permiso';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class PermisoService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/permiso/';

    public getPermisosByRolId(rolId: number): Observable<Permiso[]> {
        return this.http.get<Permiso[]>(this.baseUrl + `rol/${rolId}`);
    }

    public buscarPermisos(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getPermisos(all: boolean = false): Observable<Permiso[]> {
        return this.http.get<Permiso[]>(this.baseUrl + `?all=${all}`);
    }

    public getPermisoById(idPermiso: number): Observable<Permiso> {
        return this.http.get<Permiso>(this.baseUrl + `${idPermiso}`);
    }

    public guardarPermiso(permiso: Permiso): Observable<any> {
        return this.http.post<any>(this.baseUrl, permiso, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public guardarPermisosList(permisos: Permiso[]): Observable<any> {
        return this.http.post<any>(this.baseUrl + '/list', permisos, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarPermiso(permiso: Permiso): Observable<any> {
        return this.http.put<any>(this.baseUrl, permiso);
    }

    public eliminarPermiso(idPermiso: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idPermiso}`);
    }
}
