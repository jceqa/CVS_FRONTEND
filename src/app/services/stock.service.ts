import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Stock} from '../models/stock';

@Injectable({
    providedIn: 'root'
})

export class StockService {

    constructor(private http: HttpClient,
               // private accountService: AccountService
    ) {
    }

    /*private get headers() {
        return this.accountService.getAuthHeather();
    }*/

    private baseUrl = 'api/stock/';

    public getStocks(all: boolean = false): Observable<Stock[]> {
        return this.http.get<Stock[]>(this.baseUrl + `?all=${all}`);
    }

    public listStockByDeposito(idDeposito: number): Observable<Stock[]> {
        return this.http.get<Stock[]>(this.baseUrl + `deposito/${idDeposito}`);
    }

    public listStockByArticulo(idArticulo: number): Observable<Stock[]> {
        return this.http.get<Stock[]>(this.baseUrl + `articulo/${idArticulo}`);
    }
}
