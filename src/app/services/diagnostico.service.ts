import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Diagnostico} from '../models/diagnostico';

@Injectable({
    providedIn: 'root'
})

export class DiagnosticoService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/diagnostico/';

    public getDiagnostico(all: boolean = false): Observable<Diagnostico[]> {
        return this.http.get<Diagnostico[]>(this.baseUrl + `?all=${all}`);
    }

    public guardarDiagnostico(diagnostico: Diagnostico): Observable<any> {
        return this.http.post<any>(this.baseUrl, diagnostico, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarDiagnostico(diagnostico: Diagnostico): Observable<any> {
        return this.http.put<any>(this.baseUrl, diagnostico);
    }

    public anularDiagnostico(diagnostico: Diagnostico): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', diagnostico);
    }

    public getDiagnosticos(): Observable<Diagnostico[]> {
        return this.http.get<Diagnostico[]>(this.baseUrl + 'pendientes');
    }

    public getDiagnosticosPendientesByProveedor(idProveedor: number): Observable<Diagnostico[]> {
        return this.http.get<Diagnostico[]>(this.baseUrl + `pendientes/${idProveedor}`);
    }
}
