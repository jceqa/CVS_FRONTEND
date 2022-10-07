import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {FacturaCompra} from '../models/facturaCompra';

@Injectable({
    providedIn: 'root'
})

export class FacturaCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/facturacompra/';

    public getFacturasCompra(all: boolean = false): Observable<FacturaCompra[]> {
        return this.http.get<FacturaCompra[]>(this.baseUrl + `?all=${all}`);
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
}
