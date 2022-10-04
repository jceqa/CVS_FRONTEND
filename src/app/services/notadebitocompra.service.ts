import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {NotaDebitoCompra} from '../models/notaDebitoCompra';

@Injectable({
    providedIn: 'root'
})

export class NotaDebitoCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/notadebitocompra/';

    public getNotasDebitoCompra(all: boolean = false): Observable<NotaDebitoCompra[]> {
        return this.http.get<NotaDebitoCompra[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarNotaDebitoCompra(notaDebitoCompra: NotaDebitoCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, notaDebitoCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarNotaDebitoCompra(notaDebitoCompra: NotaDebitoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, notaDebitoCompra);
    }

    public anularNotaDebitoCompra(notaDebitoCompra: NotaDebitoCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', notaDebitoCompra);
    }
}
