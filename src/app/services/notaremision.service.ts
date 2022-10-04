import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {NotaRemision} from '../models/notaRemision';

@Injectable({
    providedIn: 'root'
})

export class NotaRemisionService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/notaremision/';

    public getNotasRemision(all: boolean = false): Observable<NotaRemision[]> {
        return this.http.get<NotaRemision[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarNotaRemision(notaRemision: NotaRemision): Observable<any> {
        return this.http.post<any>(this.baseUrl, notaRemision, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarNotaRemision(notaRemision: NotaRemision): Observable<any> {
        return this.http.put<any>(this.baseUrl, notaRemision);
    }

    public anularNotaRemision(notaRemision: NotaRemision): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', notaRemision);
    }
}
