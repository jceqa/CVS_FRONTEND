import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {PresupuestoServicio} from '../models/presupuestoServicio';

@Injectable({
    providedIn: 'root'
})

export class PresupuestoServicioService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/presupuestoservicio/';

    public getPresupuestosServicio(all: boolean = false): Observable<PresupuestoServicio[]> {
        return this.http.get<PresupuestoServicio[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarPresupuestoServicio(presupuestoServicio: PresupuestoServicio): Observable<any> {
        return this.http.post<any>(this.baseUrl, presupuestoServicio, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarPresupuestoServicio(presupuestoServicio: PresupuestoServicio): Observable<any> {
        return this.http.put<any>(this.baseUrl, presupuestoServicio);
    }

    public anularPresupuestoServicio(presupuestoServicio: PresupuestoServicio): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', presupuestoServicio);
    }

    public getPresupuestosServicioPendientes(): Observable<PresupuestoServicio[]> {
        return this.http.get<PresupuestoServicio[]>(this.baseUrl + 'pendientes');
    }

    /*public getPresupuestosServicioPendientesByProveedor(idProveedor: number): Observable<PresupuestoServicio[]> {
        return this.http.get<PresupuestoServicio[]>(this.baseUrl + `pendientes/${idProveedor}`);
    }*/
}
