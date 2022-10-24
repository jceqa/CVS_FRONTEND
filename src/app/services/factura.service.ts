import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {FacturaCompra} from '../models/facturaCompra';

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

    public guardarFacturaCompra(facturaCompra: FacturaCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, facturaCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarFacturaCompra(facturaCompra: FacturaCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, facturaCompra);
    }

    public anularFacturaCompra(facturaCompra: FacturaCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', facturaCompra);
    }

    public getFacturasComprasProcesadas(): Observable<FacturaCompra[]> {
        return this.http.get<FacturaCompra[]>(this.baseUrl + 'procesadas');
    }
}
