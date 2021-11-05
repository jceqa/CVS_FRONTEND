import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})

export class MarcaService {

    constructor(private http: HttpClient,
        private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = "api/marca/";

    public buscarMarcas(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`)
    }

    public getMarcas(): Observable<Marca[]> {
        return this.http.get<Marca[]>(this.baseUrl)
    }

    public getMarcaById(idMarca: number): Observable<Marca> {
        return this.http.get<Marca>(this.baseUrl + `${idMarca}`)
    }

    public guardarMarca(marca: Marca): Observable<any> {
        return this.http.post<any>(this.baseUrl, marca, {
            headers: this.headers,
            observe: 'response'
          });
    }

    public editarMarca(marca: Marca): Observable<any> {
        return this.http.put<any>(this.baseUrl, marca)
    }

    public eliminarMarca(idMarca: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idMarca}`)
    }
}