import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'indeDecNumber'
})
export class IndeNumberDecPipe implements PipeTransform {
    transform(
        value: number,
        decimalLength: number = 3,
        chunkDelimiter: string = '.',
        decimalDelimiter: string = ',',
        chunkLength: number = 3,
        currencySign: string = '',
        ): string {

        if (!value) return '0';

        value = +value;

        console.log('numero: ' + value);

        if (Number.isInteger(value)) decimalLength = 0;

        const result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
        // tslint:disable-next-line:no-bitwise
        const num = value.toFixed(Math.max(0, ~~decimalLength));

        return currencySign + (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
    }
}
