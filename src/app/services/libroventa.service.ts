import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {LibroVenta} from '../models/libroVenta';

@Injectable({
    providedIn: 'root'
})

export class LibroVentaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/libroventa/';

    public getLibrosVenta(all: boolean = false): Observable<LibroVenta[]> {
        return this.http.get<LibroVenta[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarLibroVenta(libroVenta: LibroVenta): Observable<any> {
        return this.http.post<any>(this.baseUrl, libroVenta, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarLibroVenta(libroVenta: LibroVenta): Observable<any> {
        return this.http.put<any>(this.baseUrl, libroVenta);
    }

    public anularLibroVenta(libroVenta: LibroVenta): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', libroVenta);
    }
}
