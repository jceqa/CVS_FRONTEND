import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CondicionPago } from '../models/condicionpago';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})

export class CondicionPagoService {

    constructor(private http: HttpClient,
        private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = "api/condicionpago/";

    public buscarCondicionPagos(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`)
    }

    public getCondicionPagos(): Observable<CondicionPago[]> {
        return this.http.get<CondicionPago[]>(this.baseUrl)
    }

    public getCondicionPagoById(idCondicionPago: number): Observable<CondicionPago> {
        return this.http.get<CondicionPago>(this.baseUrl + `${idCondicionPago}`)
    }

    public guardarCondicionPago(condicionpago: CondicionPago): Observable<any> {
        return this.http.post<any>(this.baseUrl, condicionpago, {
            headers: this.headers,
            observe: 'response'
          });
    }

    public editarCondicionPago(condicionpago: CondicionPago): Observable<any> {
        return this.http.put<any>(this.baseUrl, condicionpago)
    }

    public eliminarCondicionPago(idCondicionPago: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idCondicionPago}`)
    }
}