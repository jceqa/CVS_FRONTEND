import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Impuesto } from '../models/impuesto';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})

export class ImpuestoService {

    constructor(private http: HttpClient,
        private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = "api/impuesto/";

    public buscarImpuestos(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`)
    }

    public getImpuestos(): Observable<Impuesto[]> {
        return this.http.get<Impuesto[]>(this.baseUrl)
    }

    public getImpuestoById(idImpuesto: number): Observable<Impuesto> {
        return this.http.get<Impuesto>(this.baseUrl + `${idImpuesto}`)
    }

    public guardarImpuesto(impuesto: Impuesto): Observable<any> {
        return this.http.post<any>(this.baseUrl, impuesto, {
            headers: this.headers,
            observe: 'response'
          });
    }

    public editarImpuesto(impuesto: Impuesto): Observable<any> {
        return this.http.put<any>(this.baseUrl, impuesto)
    }

    public eliminarImpuesto(idImpuesto: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idImpuesto}`)
    }
}