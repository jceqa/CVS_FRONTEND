import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {CuentaAPagar} from '../models/cuentaAPagar';

@Injectable({
    providedIn: 'root'
})

export class CuentaAPagarService {
    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/cuentaapagar/';

    public getCuentasAPagar(all: boolean = false): Observable<CuentaAPagar[]> {
        return this.http.get<CuentaAPagar[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarCuentaAPagar(cuentaAPagar: CuentaAPagar): Observable<any> {
        return this.http.post<any>(this.baseUrl, cuentaAPagar, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarCuentaAPagar(cuentaAPagar: CuentaAPagar): Observable<any> {
        return this.http.put<any>(this.baseUrl, cuentaAPagar);
    }

    public anularCuentaAPagar(cuentaAPagar: CuentaAPagar): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', cuentaAPagar);
    }
}
