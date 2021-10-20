import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { httpStatus } from '../models/dictionary';

@Injectable()
export class UIService {
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar) { }

    showSnackbar(message, action, duration) {
        this.snackbar.open(message, action, {
            duration: duration
        });
    }

    hideSnackbar() {
        this.snackbar.dismiss();
    }

    httpStatusSnackbar(status: number, msgDetail: string) {
        let duration = 0;
        if (status >= 400) {
            duration = 3000;
        }
        console.log('-> Message : ' + msgDetail); // NO BORRAR!!! Imprime el detalle del error en el log
        this.showSnackbar(httpStatus[status], 'cerrar', duration);
    }

    httpSuc(msg?: string) {
        if (msg != null && msg !== '') {
            this.showSnackbar(httpStatus[200] + '. ' + msg, 'Cerrar', 7000);
        } else {
            this.showSnackbar(httpStatus[200], 'Cerrar', 2000);
        }
    }

    httpErr(err: any, handleNotFound = false) {
        console.log('Error: ', err);

        let msg: string;
        if (handleNotFound && err.status != null && err.status === 404) {

            msg = 'No existe';

        } else if (err.error && err.error.error_description) {
            // joc 11/05/2020
            msg = err.error.error_description;
        } else if (err.error && err.error.Message) {
            msg = err.error.Message;
        } else if (err.message) {
            msg = err.message;
        } else {
            msg = httpStatus[err.status];
        }

        this.showSnackbar(msg, 'Cerrar', 0);
    }

    httpCgiSuc(suc: HttpResponse<Object>) {
        console.log('respuesta del cgi: ' + suc.body.toString()); // NO BORRAR!!!
        if (suc.body.toString().indexOf('OK') !== -1) {
            // está OK
        } else {
            this.showSnackbar('Ha ocurrido un error al acceder al CGI', 'Cerrar', 0);
        }
    }

    httpCgiErr(err: HttpErrorResponse) {
        console.log('respuesta del cgi: ' + err.error.text);
        if (err.status === 200 && err.error.text.indexOf('OK') !== -1) {
            // está OK
        } else {
            this.showSnackbar('Ha ocurrido un error al acceder al CGI', 'Cerrar', 0);
        }
    }
}
