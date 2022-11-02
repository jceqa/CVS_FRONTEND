import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Reclamo} from '../models/reclamo';

@Injectable({
    providedIn: 'root'
})

export class ReclamoService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/reclamo/';

    public getReclamos(all: boolean = false): Observable<Reclamo[]> {
        return this.http.get<Reclamo[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarReclamo(reclamo: Reclamo): Observable<any> {
        return this.http.post<any>(this.baseUrl, reclamo, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarReclamo(reclamo: Reclamo): Observable<any> {
        return this.http.put<any>(this.baseUrl, reclamo);
    }

    public anularReclamo(reclamo: Reclamo): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', reclamo);
    }

    public getReclamosPendientes(): Observable<Reclamo[]> {
        return this.http.get<Reclamo[]>(this.baseUrl + 'pendientes');
    }
}
