import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Recepcion} from '../models/recepcion';

@Injectable({
    providedIn: 'root'
})

export class RecepcionService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/recepcion/';

    public getRecepcion(all: boolean = false): Observable<Recepcion[]> {
        return this.http.get<Recepcion[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarRecepcion(recepcion: Recepcion): Observable<any> {
        return this.http.post<any>(this.baseUrl, recepcion, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarRecepcion(recepcion: Recepcion): Observable<any> {
        return this.http.put<any>(this.baseUrl, recepcion);
    }

    public anularRecepcion(recepcion: Recepcion): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', recepcion);
    }

    public getRecepcionPendientes(): Observable<Recepcion[]> {
        return this.http.get<Recepcion[]>(this.baseUrl + 'pendientes');
    }
}
