import { Pipe, PipeTransform } from '@angular/core';

// const PADDING = '000000';

@Pipe({ name: 'myCurrency' })
export class MyCurrencyPipe implements PipeTransform {

    // private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor() {
        // TODO comes from configuration settings
        // this.DECIMAL_SEPARATOR = ',';
        this.THOUSANDS_SEPARATOR = '.';
    }

    transform(value: number | string): string {
        /*let [ integer, fraction = '' ] = (value || '').toString()
            .split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';*/

        value = value.toString().replace(/\D/g, '');

        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return value;
    }

    parse(value: string): string {
        /*let [ integer, fraction = '' ] = (value || '').split(this.DECIMAL_SEPARATOR);*/

        value = value.replace( /[.]/g, '');

        /*fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';*/

        return value;
    }

}
