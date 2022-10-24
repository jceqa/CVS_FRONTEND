import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Factura} from '../models/factura';

@Injectable({
    providedIn: 'root'
})

export class FacturaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/factura/';

    public getFacturas(all: boolean = false): Observable<Factura[]> {
        return this.http.get<Factura[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarFactura(factura: Factura): Observable<any> {
        return this.http.post<any>(this.baseUrl, factura, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarFactura(factura: Factura): Observable<any> {
        return this.http.put<any>(this.baseUrl, factura);
    }

    public anularFactura(factura: Factura): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', factura);
    }

    public getFacturasProcesadas(): Observable<Factura[]> {
        return this.http.get<Factura[]>(this.baseUrl + 'procesadas');
    }
}
