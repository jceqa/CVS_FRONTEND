import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo } from '../models/equipo';

@Injectable({
    providedIn: 'root'
})

export class EquipoService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = "api/equipo/";

    public listEquipos(): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar`)
    }

    public getEquipoById(id: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/id?equi_id=${id}`)
    }

    public guardarEquipo(equipo: Equipo): Observable<any> {
        return this.http.post<any>(this.baseUrl + `agregar`, equipo)
    }

    public editarEquipo(equipo: Equipo): Observable<any> {
        return this.http.put<any>(this.baseUrl + `modificar`, equipo)
    }

    public eliminarEquipo(idEquipo: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `eliminar?equi_id=${idEquipo}`)
    }
}