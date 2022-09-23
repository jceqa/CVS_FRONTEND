import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Permiso} from '../models/permiso';

@Injectable({
    providedIn: 'root'
})

export class PermisoService {

    constructor(private http: HttpClient,
    ) {
    }

    private baseUrl = 'api/permiso/';

    public getPermisosByRolId(rolId: number): Observable<Permiso[]> {
        return this.http.get<Permiso[]>(this.baseUrl + `rol/${rolId}`);
    }
}
