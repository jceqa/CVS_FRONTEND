import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Equipo} from '../models/equipo';

@Injectable({
    providedIn: 'root'
})

export class EquipoService {

    constructor(private http: HttpClient,
    ) {
    }

    private baseUrl = 'api/equipo/';

    public listEquipos(all: boolean = false): Observable<any> {
        return this.http.get<any>(this.baseUrl + `?all=${all}`);
    }

    public getEquipoById(id: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `${id}`);
    }

    public guardarEquipo(equipo: Equipo): Observable<any> {
        return this.http.post<any>(this.baseUrl, equipo);
    }

    public editarEquipo(equipo: Equipo): Observable<any> {
        return this.http.put<any>(this.baseUrl, equipo);
    }

    public eliminarEquipo(idEquipo: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idEquipo}`);
    }

    public listEquiposByCliente(idCliente: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `cliente/${idCliente}`);
    }
}
