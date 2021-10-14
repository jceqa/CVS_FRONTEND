import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { environment } from '../../../environments/environment';
import { Browser } from '../models/enum';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class UtilService {
    /*private get endpoint() {
      return environment.apiUrl + 'Util';
    }
    private headers = this.getApiKeyHeather();
  */
    constructor(private httpClient: HttpClient) { }

    /*getConnectType() {
      return this.httpClient.get<any>(this.endpoint + '/conex', {
        headers: this.headers
      });
      // .map(res => res);
    }*/

    public getApiKeyHeather(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            api_key: '305721340fa99aff67b2060542a1bec2'
        });
    }

    isDevMode(): boolean {
        return isDevMode();
    }

    fillLocalStorage() {
        localStorage.setItem('token', sessionStorage.getItem('token'));
        localStorage.setItem('expiration', sessionStorage.getItem('expiration'));
        localStorage.setItem('username', sessionStorage.getItem('username'));
    }

    /*fillSessionStorage() {
      sessionStorage.setItem('token', localStorage.getItem('token'));
      sessionStorage.setItem('expiration', localStorage.getItem('expiration'));
      sessionStorage.setItem('username', localStorage.getItem('username'));
    }*/



    toParams = function ObjectsToParams(obj) {
        const p = [];
        // tslint:disable-next-line:forin
        for (const key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };

    stringSort(array: any, orderBy: string): any {
        array.sort((a, b) => {
            const nameA = a[orderBy].toUpperCase();
            const nameB = b[orderBy].toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        return array;
    }

    getBrowser(): Browser {
        let sBrowser: Browser;
        const sUsrAg = navigator.userAgent;

        if (sUsrAg.indexOf('Firefox') > -1) {
            sBrowser = Browser.FIREFOX;
        } else if (sUsrAg.indexOf('Opera') > -1) {
            sBrowser = Browser.OPERA;
        } else if (sUsrAg.indexOf('Trident') > -1) {
            sBrowser = Browser.IE;
        } else if (sUsrAg.indexOf('Edge') > -1) {
            sBrowser = Browser.EDGE;
        } else if (sUsrAg.indexOf('Chrome') > -1) {
            sBrowser = Browser.EDGE;
        } else if (sUsrAg.indexOf('Safari') > -1) {
            sBrowser = Browser.SAFARI;
        } else {
            sBrowser = Browser.UNKNOWN;
        }
        return sBrowser;
    }

    lastIndexOf(string: string, toFind: string): number {
        return string.indexOf(toFind) === -1 ? -1 : string.indexOf(toFind) + toFind.length;
    }

    insertStringPost(string: string, toInsert: string, toFind: string = ''): string {
        const pos = toFind === '' ? -1 : this.lastIndexOf(string, toFind);
        return pos === -1 ? string + toInsert : string.slice(0, pos) + toInsert + string.slice(pos);
    }

    insertStringPre(string: string, toInsert: string, toFind: string): string {
        const pos = string.indexOf(toFind);
        return pos === -1 ? string + toInsert : string.slice(0, pos) + toInsert + string.slice(pos);
    }

    /* clobo 03/05/2021
      dateToString(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      }
    */
    dateToString(date: Date, separator: string = '-'): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}${separator}${month}${separator}${day}`;
    }

    setDefault(control: AbstractControl, result: any) {
        // debugger;
        if (result.length === 1) control.setValue(result[0].id);
    }

    //
    Unidades(num) {

        switch (num) {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }// Unidades()

    Decenas(num) {

        const decena = Math.floor(num / 10);
        const unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + this.Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + this.Unidades(unidad);
                }
            case 3: return this.DecenasY('TREINTA', unidad);
            case 4: return this.DecenasY('CUARENTA', unidad);
            case 5: return this.DecenasY('CINCUENTA', unidad);
            case 6: return this.DecenasY('SESENTA', unidad);
            case 7: return this.DecenasY('SETENTA', unidad);
            case 8: return this.DecenasY('OCHENTA', unidad);
            case 9: return this.DecenasY('NOVENTA', unidad);
            case 0: return this.Unidades(unidad);
        }
    }// Unidades()

    DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + this.Unidades(numUnidades);

        return strSin;
    }// DecenasY()

    Centenas(num) {
        const centenas = Math.floor(num / 100);
        const decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + this.Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
            case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
            case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
        }

        return this.Decenas(decenas);
    }// Centenas()

    Seccion(num, divisor, strSingular, strPlural) {
        const cientos = Math.floor(num / divisor);
        const resto = num - (cientos * divisor);

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = this.Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }// Seccion()

    Miles(num) {
        const divisor = 1000;
        const cientos = Math.floor(num / divisor);
        const resto = num - (cientos * divisor);

        const strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
        const strCentenas = this.Centenas(resto);

        if (strMiles === '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }// Miles()

    Millones(num) {
        const divisor = 1000000;
        const cientos = Math.floor(num / divisor);
        const resto = num - (cientos * divisor);

        const strMillones = this.Seccion(num, divisor, 'UN MILLON', 'MILLONES');
        const strMiles = this.Miles(resto);

        if (strMillones === '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    }// Millones()

    numeroALetras(num, currency) {
        currency = currency || {};
        const data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: ((Math.round(num * 100)) - (Math.floor(num) * 100)),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || '',
            letrasMonedaSingular: currency.singular || '',
            letrasMonedaCentavoPlural: currency.centPlural || '',
            letrasMonedaCentavoSingular: currency.centSingular || ''
        };

        if (data.centavos > 0) {
            let centavos = '';
            if (data.centavos === 1)
                centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
            else
                centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            data.letrasCentavos = 'CON ' + centavos;
        }

        if (data.enteros === 0)
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros === 1)
            return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }
    //

    getRawHTML(url: string): any {
        this.httpClient.get(url, { responseType: 'text' });
    }

    getWeight(url: string): any {
        // const url = 'http://10.10.21.30:8800/weigh';
        // this.httpClient.get(url, {headers: this.headers});
        return this.httpClient.get(url);
    }
}
