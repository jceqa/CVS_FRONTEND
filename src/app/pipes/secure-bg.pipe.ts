import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AccountService } from '../services/account.service';

@Pipe({
  name: 'securebg'
})
export class SecureBgPipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private account: AccountService) {}

  transform(url: string): Observable<SafeUrl> {
    return this.http
      .get(url, { responseType: 'blob', headers: { 'api_key': this.account.getClientApiKey()} })
      // .map(val => this.sanitizer.bypassSecurityTrustStyle( 'url(' +  URL.createObjectURL(val)) + ')');
      .map(val => this.sanitizer.bypassSecurityTrustStyle('url(' + URL.createObjectURL(val) + ')'));
    // .map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)));
  }
}
