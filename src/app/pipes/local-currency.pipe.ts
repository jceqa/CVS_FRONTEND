import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatCurrency, getLocaleCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'localCurrency'
})
export class LocalCurrencyPipe implements PipeTransform {

  constructor(
    @Inject( LOCALE_ID ) private _localeId: string
  ) {}

  transform(value: number, currencyCode?: string, digitInfo?: string): any {
    console.log(this._localeId );
    return formatCurrency(value, this._localeId, getLocaleCurrencySymbol( this._localeId ), currencyCode, digitInfo);
  }

}
