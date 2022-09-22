import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {PedidoCompra} from '../models/pedidoCompra';

@Injectable({
    providedIn: 'root'
})


export class PedidoCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/pedidocompra/';

    public getPedidosCompra(all: boolean = false): Observable<PedidoCompra[]> {
        return this.http.get<PedidoCompra[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarPedidoCompra(pedidoCompra: PedidoCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, pedidoCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarPedidoCompra(pedidoCompra: PedidoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, pedidoCompra);
    }

    public anularPedidoCompra(pedidoCompra: PedidoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', pedidoCompra);
    }
}
