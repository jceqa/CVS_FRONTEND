import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Cobro} from '../models/cobro';
import {Filtro} from '../models/filtro';

@Injectable({
    providedIn: 'root'
})

export class CobroService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/cobro/';

    public getCobros(all: boolean = false): Observable<Cobro[]> {
        return this.http.get<Cobro[]>(this.baseUrl + `?all=${all}`);
    }

    public filterCobrosByDate(filtro: Filtro): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'filter', filtro, {
            headers: this.headers,
            observe: 'response'
        });
    }

}
