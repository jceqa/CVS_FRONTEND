import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {OrdenServicio} from '../models/ordenServicio';

@Injectable({
    providedIn: 'root'
})

export class OrdenServicioService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/ordenservicio/';

    public getOrdenesServicio(all: boolean = false): Observable<OrdenServicio[]> {
        return this.http.get<OrdenServicio[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarOrdenServicio(ordenServicio: OrdenServicio): Observable<any> {
        return this.http.post<any>(this.baseUrl, ordenServicio, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarOrdenServicio(ordenServicio: OrdenServicio): Observable<any> {
        return this.http.put<any>(this.baseUrl, ordenServicio);
    }

    public anularOrdenServicio(ordenServicio: OrdenServicio): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', ordenServicio);
    }

    public getOrdenServicioPendientes(): Observable<OrdenServicio[]> {
        return this.http.get<OrdenServicio[]>(this.baseUrl + 'pendientes');
    }
}
