import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PermisoService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = "api/permiso/";

    public getPermisosByRolId(rolId: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/rol/id?id_rol=${rolId}`)
    }
}