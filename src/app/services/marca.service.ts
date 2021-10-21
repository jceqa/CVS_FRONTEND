import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';

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

    public getMarcas() : Observable<any>{
        return this.http.get<any>(this.baseUrl + `buscar`)
    }

    public getMarcaById(idMarca: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/id?mar_id=${idMarca}`)
    }

    public guardarMarca(marca: Marca): Observable<any> {
        return this.http.post<any>(this.baseUrl + `agregar?descripcion=${marca.descripcion}`, marca);
    }

    public editarMarca(marca: Marca): Observable<any> {
        return this.http.put<any>(this.baseUrl +
            `modificar?id=${marca.id}&descripcion=${marca.descripcion}`, marca)
    }

    public eliminarMarca(idMarca: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `eliminar?mar_id=${idMarca}`)
    }
}