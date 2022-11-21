import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Pago} from '../models/pago';

@Injectable({
    providedIn: 'root'
})

export class PagoService {

    constructor(private http: HttpClient,
                // private accountService: AccountService
    ) { }

    /*private get headers() {
        return this.accountService.getAuthHeather();
    }*/

    private baseUrl = 'api/pago/';

    public getPagos(all: boolean = false): Observable<Pago[]> {
        return this.http.get<Pago[]>(this.baseUrl + `?all=${all}`);
    }

    public filterPagosByDate(fechaInicio: Date, fechaFin: Date): Observable<Pago[]> {
        return this.http.get<Pago[]>(this.baseUrl + `filter?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    }
}
