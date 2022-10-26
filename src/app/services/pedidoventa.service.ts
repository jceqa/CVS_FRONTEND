import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {PedidoVenta} from '../models/pedidoVenta';

@Injectable({
    providedIn: 'root'
})

export class PedidoVentaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/pedidoventa/';

    public getPedidosVenta(all: boolean = false): Observable<PedidoVenta[]> {
        return this.http.get<PedidoVenta[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarPedidoVenta(pedidoVenta: PedidoVenta): Observable<any> {
        return this.http.post<any>(this.baseUrl, pedidoVenta, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarPedidoVenta(pedidoVenta: PedidoVenta): Observable<any> {
        return this.http.put<any>(this.baseUrl, pedidoVenta);
    }

    public anularPedidoVenta(pedidoVenta: PedidoVenta): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', pedidoVenta);
    }

    public getPedidosVentaPendientes(): Observable<PedidoVenta[]> {
        return this.http.get<PedidoVenta[]>(this.baseUrl + 'pendientes');
    }

    public getPedidosVentaPendientesByCliente(idCliente: number): Observable<PedidoVenta[]> {
        return this.http.get<PedidoVenta[]>(this.baseUrl + `pendientes/cliente/${idCliente}`);
    }
}
