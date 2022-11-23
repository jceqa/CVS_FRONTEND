import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {CuentaACobrar} from '../models/cuentaACobrar';

@Injectable({
    providedIn: 'root'
})

export class CuentaACobrarService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/cuentaacobrar/';

    public getCuentasACobrar(all: boolean = false): Observable<CuentaACobrar[]> {
        return this.http.get<CuentaACobrar[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarCuentaACobrar(cuentaACobrar: CuentaACobrar): Observable<any> {
        return this.http.post<any>(this.baseUrl, cuentaACobrar, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarCuentaACobrar(cuentaACobrar: CuentaACobrar): Observable<any> {
        return this.http.put<any>(this.baseUrl, cuentaACobrar);
    }

    public anularCuentaACobrar(cuentaACobrar: CuentaACobrar): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', cuentaACobrar);
    }

    public getCuentasACobrarPendientes(): Observable<CuentaACobrar[]> {
        return this.http.get<CuentaACobrar[]>(this.baseUrl + 'pendientes');
    }

    public processCuentaACobrar(cuentaACobrar: CuentaACobrar): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'procesar', cuentaACobrar);
    }
}
