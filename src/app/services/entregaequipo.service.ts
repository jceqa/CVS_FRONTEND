import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {EntregaEquipo} from '../models/entregaEquipo';

@Injectable({
    providedIn: 'root'
})

export class EntregaEquipoService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/entregaequipo/';

    public getEntregaEquipos(all: boolean = false): Observable<EntregaEquipo[]> {
        return this.http.get<EntregaEquipo[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarEntregaEquipo(entregaEquipo: EntregaEquipo): Observable<any> {
        return this.http.post<any>(this.baseUrl, entregaEquipo, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarEntregaEquipo(entregaEquipo: EntregaEquipo): Observable<any> {
        return this.http.put<any>(this.baseUrl, entregaEquipo);
    }

    public anularEntregaEquipo(entregaEquipo: EntregaEquipo): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', entregaEquipo);
    }

    public getEntregaEquiposPendientes(): Observable<EntregaEquipo[]> {
        return this.http.get<EntregaEquipo[]>(this.baseUrl + 'pendientes');
    }
}
