import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})

export class EstadoService {

    constructor(private http: HttpClient,
        private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = "api/estado/";

    public buscarEstados(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`)
    }

    public getEstados(): Observable<Estado[]> {
        return this.http.get<Estado[]>(this.baseUrl)
    }

    public getEstadoById(idEstado: number): Observable<Estado> {
        return this.http.get<Estado>(this.baseUrl + `${idEstado}`)
    }

    public guardarEstado(estado: Estado): Observable<any> {
        return this.http.post<any>(this.baseUrl, estado, {
            headers: this.headers,
            observe: 'response'
          });
    }

    public editarEstado(estado: Estado): Observable<any> {
        return this.http.put<any>(this.baseUrl, estado)
    }

    public eliminarEstado(idEstado: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idEstado}`)
    }
}