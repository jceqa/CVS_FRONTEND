import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {OrdenCompra} from '../models/ordenCompra';

@Injectable({
    providedIn: 'root'
})

export class OrdenCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/ordencompra/';

    public getOrdenesCompra(all: boolean = false): Observable<OrdenCompra[]> {
        return this.http.get<OrdenCompra[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarOrdenCompra(ordenCompra: OrdenCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, ordenCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarOrdenCompra(ordenCompra: OrdenCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, ordenCompra);
    }

    public anularOrdenCompra(ordenCompra: OrdenCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', ordenCompra);
    }

    public getOrdenCompraPendientes(): Observable<OrdenCompra[]> {
        return this.http.get<OrdenCompra[]>(this.baseUrl + 'pendientes');
    }
}
