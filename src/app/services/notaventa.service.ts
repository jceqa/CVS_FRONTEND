import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {NotaVenta} from '../models/notaVenta';

@Injectable({
    providedIn: 'root'
})

export class NotaVentaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/notaventa/';

    public getNotasVenta(all: boolean = false): Observable<NotaVenta[]> {
        return this.http.get<NotaVenta[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarNotaVenta(notaVenta: NotaVenta): Observable<any> {
        return this.http.post<any>(this.baseUrl, notaVenta, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarNotaVenta(notaVenta: NotaVenta): Observable<any> {
        return this.http.put<any>(this.baseUrl, notaVenta);
    }

    public anularNotaVenta(notaVenta: NotaVenta): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', notaVenta);
    }

    public getNotaVentaPendientes(): Observable<NotaVenta[]> {
        return this.http.get<NotaVenta[]>(this.baseUrl + 'pendientes');
    }

    public getNotasVentaPendientesByCliente(idCliente: number): Observable<NotaVenta[]> {
        return this.http.get<NotaVenta[]>(this.baseUrl + `pendientes/${idCliente}`);
    }
}
