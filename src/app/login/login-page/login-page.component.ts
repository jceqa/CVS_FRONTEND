import { Component, OnInit } from '@angular/core';
//import { AccountService } from '../../../services/account.service';
import { MatDialog } from '@angular/material/dialog';
import {Router, ActivatedRoute, RouteReuseStrategy} from '@angular/router';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  returnUrl!: string;

  constructor(
    //public accountService: AccountService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public routeStrat: RouteReuseStrategy,
    private router: Router) {}
  ngOnInit() {
     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
     setTimeout(() => {
      this.openLoginDialog();
     }, 100);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // borramos el cache si tiene algo guardado
      this.clearCatalogCache();
      if ( this.returnUrl === '/public/catalog/(sub:payment_method)') {
        this.router.navigate(['/public/catalog', { outlets: { sub: ['payment_method'] } }]);
      } else if (result && this.returnUrl) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  clearCatalogCache() {
    /*if (this.router.routeReuseStrategy['handlers']) {
      this.router.routeReuseStrategy['handlers'] = {};
    }*/
  }

}
