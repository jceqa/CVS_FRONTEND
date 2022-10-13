import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PromoDescuento} from '../models/promodescuento';

@Injectable({
    providedIn: 'root'
})

export class PromoDescuentoService {

    constructor(private http: HttpClient,
    ) {
    }

    private baseUrl = 'api/promodescuento/';

    public listPromoDescuentos(all: boolean = false): Observable<any> {
        return this.http.get<any>(this.baseUrl + `?all=${all}`);
    }

    public getPromoDescuentoById(id: number): Observable<any> {
        return this.http.get<any>(this.baseUrl + `${id}`);
    }

    public guardarPromoDescuento(promoDescuento: PromoDescuento): Observable<any> {
        return this.http.post<any>(this.baseUrl, promoDescuento);
    }

    public editarPromoDescuento(promoDescuento: PromoDescuento): Observable<any> {
        return this.http.put<any>(this.baseUrl, promoDescuento);
    }

    public eliminarPromoDescuento(idPromoDescuento: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idPromoDescuento}`);
    }
}
