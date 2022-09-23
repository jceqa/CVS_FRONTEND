import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {PresupuestoCompra} from '../models/presupuestoCompra';

@Injectable({
    providedIn: 'root'
})

export class PresupuestoCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/presupuestocompra/';

    public getPresupuestosCompra(all: boolean = false): Observable<PresupuestoCompra[]> {
        return this.http.get<PresupuestoCompra[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarPresupuestoCompra(presupuestoCompra: PresupuestoCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, presupuestoCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarPresupuestoCompra(presupuestoCompra: PresupuestoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, presupuestoCompra);
    }

    public anularPresupuestoCompra(presupuestoCompra: PresupuestoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', presupuestoCompra);
    }

    public getPresupuestosCompraPendientes(): Observable<PresupuestoCompra[]> {
        return this.http.get<PresupuestoCompra[]>(this.baseUrl + 'pendientes');
    }
}
