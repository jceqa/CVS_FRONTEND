import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Servicio} from '../models/servicio';

@Injectable({
    providedIn: 'root'
})

export class ServicioService {

    constructor(private http: HttpClient,
    ) {
    }

    private baseUrl = 'api/servicio/';

    public listServicios(all: boolean = false): Observable<any> {
        return this.http.get<any>(this.baseUrl + `?all=${all}`);
    }

    public getServicioById(id: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `${id}`);
    }

    public guardarServicio(equipo: Servicio): Observable<any> {
        return this.http.post<any>(this.baseUrl, equipo);
    }

    public editarServicio(servicio: Servicio): Observable<any> {
        return this.http.put<any>(this.baseUrl, servicio);
    }

    public eliminarServicio(idServicio: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idServicio}`);
    }
}
