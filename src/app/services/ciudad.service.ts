import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from '../models/ciudad';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})

export class CiudadService {

    constructor(private http: HttpClient,
        private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = 'api/ciudad/';

    public buscarCiudades(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getCiudades(all: boolean = false): Observable<Ciudad[]> {
        return this.http.get<Ciudad[]>(this.baseUrl + `?all=${all}`);
    }

    public getCiudadById(idCiudad: number): Observable<Ciudad> {
        return this.http.get<Ciudad>(this.baseUrl + `${idCiudad}`);
    }

    public guardarCiudad(ciudad: Ciudad): Observable<any> {
        return this.http.post<any>(this.baseUrl, ciudad, {
            headers: this.headers,
            observe: 'response'
          });
    }

    public editarCiudad(ciudad: Ciudad): Observable<any> {
        return this.http.put<any>(this.baseUrl, ciudad);
    }

    public eliminarCiudad(idCiudad: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idCiudad}`);
    }
}
