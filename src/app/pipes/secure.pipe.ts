import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AccountService } from '../services/account.service';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private account: AccountService
  ) {}

  transform(url: string): Observable<SafeUrl> {
    let headers: any;
    if (this.account.authenticated) headers = this.account.getAuthHeather();
    else headers = { api_key: this.account.getClientApiKey() };
    return this.http
      .get(url, { responseType: 'blob' , headers: headers })
      .map(val => {
          return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val));
        }
      );
  }
}
