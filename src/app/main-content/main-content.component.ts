//import { environment } from './../../../../environments/environment';
import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
//import {Store} from '@ngrx/store';
//import {Observable} from 'rxjs';
//import * as fromRoot from '../app.reducer';
//import {AppUser} from '../../../shared/models/appuser';
//import {AccountService} from '../../services/account.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
//import {LoginDialogComponent} from '../login/login-dialog/login-dialog.component';
//import {UserRegisterComponent} from '../../../security/components/usuarios/user-register/user-register.component';
//import { DomSanitizer } from '@angular/platform-browser';
import { LoginDialogComponent } from '../login/login-dialog/login-dialog.component';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnChanges {
  //isLoading$: Observable<boolean>;
  //user: AppUser;
  //company: Company;
  inImgBase64: any = '';
  //authenticated: boolean;
  apkName = '';
  googlePlay = '';
  imageLoaded = false;
  constructor(
    //private domSanitizer: DomSanitizer,
    public loginService: LoginService,
    //private store: Store<fromRoot.State>,
    private dialog: MatDialog,
    private router: Router,
    //private companiesService: CompaniesService,
    //private uiService: UIService
  ) {
  }

  ngOnInit() {
    /*this.authenticated = this.accountService.authenticated;
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.store.select('company').subscribe(company => {
      if (company && this.authenticated) {
        this.getCompanyById(company.id);
      }
    });*/

    /*this.apkName = environment.apkName;
    this.googlePlay = environment.googlePlay;*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  /*getCompanyById(id: number) {
    this.companiesService.getCompanyById(id)
      .subscribe(company => {
          this.company = company;
          const logo = atob(company.logo);
          this.inImgBase64 = this.domSanitizer.bypassSecurityTrustResourceUrl(logo);
        },
        (error) => {
          console.error('[ERROR]: ', error);
          this.uiService.showSnackbar(
            'Error al recuperar la Empresa',
            'Cerrar',
            5000
          );
        },
        () => {
        }
      );
  }*/

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      // width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
  }


  /*openRegisterDialog(): void {
    const dialogRegister = this.dialog.open(UserRegisterComponent, {
      width: '500px'
    });

    dialogRegister.afterClosed().subscribe(result => console.log(result));
  }*/
}
