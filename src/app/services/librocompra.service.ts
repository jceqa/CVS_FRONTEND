import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {LibroCompra} from '../models/libroCompra';

@Injectable({
    providedIn: 'root'
})

export class LibroCompraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/librocompra/';

    public getLibrosCompra(all: boolean = false): Observable<LibroCompra[]> {
        return this.http.get<LibroCompra[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarLibroCompra(libroCompra: LibroCompra): Observable<any> {
        return this.http.post<any>(this.baseUrl, libroCompra, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarLibroCompra(libroCompra: LibroCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl, libroCompra);
    }

    public anularLibroCompra(libroCompra: LibroCompra): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', libroCompra);
    }
}
