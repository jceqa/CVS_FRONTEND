import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class MarcaService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = "api/marca/";

    public getBuscarMarcas(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`)
    }

    public getMarcaById(idMarca: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/id?mar_id${idMarca}`)
    }
}