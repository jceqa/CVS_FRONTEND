import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import {MyCurrencyPipe} from '../pipes/my-currency-pipe';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[myCurrencyFormatter]' })
export class MyCurrencyFormatterDirective implements OnInit {

    private el: HTMLInputElement;

    constructor(
        private elementRef: ElementRef,
        private currencyPipe: MyCurrencyPipe
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit() {
        this.el.value = this.currencyPipe.transform(this.el.value);
    }

    /*@HostListener('focus', ['$event.target.value'])
    onFocus(value) {
        this.el.value = this.currencyPipe.parse(value); // opossite of transform
    }*/

    @HostListener('keyup', ['$event.target.value'])
    onBlur(value) {
        this.el.value = this.currencyPipe.transform(value);
    }

}
