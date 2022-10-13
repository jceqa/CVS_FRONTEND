import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {NotaCreditoCompra} from '../models/notaCreditoCompra';

@Injectable({
    providedIn: 'root'
})

export class NotaCreditoCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/notacreditocompra/';

    public getNotasCreditoCompra(all: boolean = false): Observable<NotaCreditoCompra[]> {
        return this.http.get<NotaCreditoCompra[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarNotaCreditoCompra(notaCreditoCompra: NotaCreditoCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, notaCreditoCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarNotaCreditoCompra(notaCreditoCompra: NotaCreditoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, notaCreditoCompra);
    }

    public anularNotaCreditoCompra(notaCreditoCompra: NotaCreditoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', notaCreditoCompra);
    }

    public getNotaCreditoCompraPendientes(): Observable<NotaCreditoCompra[]> {
        return this.http.get<NotaCreditoCompra[]>(this.baseUrl + 'pendientes');
    }
}
