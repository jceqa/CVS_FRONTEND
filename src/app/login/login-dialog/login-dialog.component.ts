import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
//import { ActivatedRoute, Router } from '@angular/router';
//import { Store } from '@ngrx/store';
import { Observable, /*Subscription*/ } from 'rxjs';
import { Usuario } from '../../models/usuario';
//import { LoginService } from "../../services/login.service";
import { UsuarioService } from '../../services/usuario.service';
//import * as fromRoot from '../../../../app.reducer';
//import * as UI from '../../../../shared/reducers/ui.actions';
//import * as Auth from '../../../reducers/account.actions';
//import { LoginClaims } from '../../../../shared/models/appuser';
//import { AccountService } from '../../../services/account.service';
//import { UIService } from '../../../services/ui.service';
//import { Menu } from '../../../models/menu';
//import { PermissionId } from '../../../models/permissionId';
//import { StockService } from '../../../../stock/services/stock.service';
//import * as fromCompanys from '../../../reducers/companys.actions';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    invalidLogin!: boolean;
    errorMsg!: string;
    isLoading$!: Observable<boolean>;
    user: Usuario;
    hidePwd!: boolean;
    recoverMode = false;
    resetPasswordMode = false;
    okButtonTitle = 'Ingresar';
    //private loginSubscription: Subscription;

    // Declaración del formulario
    form!: FormGroup;
    fields!: { [key: string]: AbstractControl };

    userName!: string;
    // Login
    @ViewChild('userNameInput') userNameInput!: ElementRef;
    @ViewChild('passwordInput') passwordInput!: ElementRef;
    // Recover Password
    @ViewChild('emailInput') emailInput!: ElementRef;
    // Reset Password
    @ViewChild('codeInput') codeInput!: ElementRef;

    constructor(
        //private router: Router,
        //private route: ActivatedRoute,
        //private _location: Location,
        private dialogRef: MatDialogRef<LoginDialogComponent>,
        //private loginService: LoginService,
        private usuarioService: UsuarioService,
        //private accountService: AccountService,
        private snackBar: MatSnackBar,
        //private uiService: UIService,
        //private store: Store<fromRoot.State>,
        //private stockService: StockService,
    ) { }

    ngOnInit() {

        //this.isLoading$ = this.store.select(fromRoot.getIsLoading);
        this.invalidLogin = false;
        this.hidePwd = true;
        //this.userName = this.accountService.username;

        //this.user = <LoginClaims>{};
        this.setLoginMode();
        // this.isAuth$ = this.store.select(fromRoot.getIsAuth);
        // console.log(this.isAuth$);
        /*this.loginSubscription = this.isAuth$.subscribe(result => {
            debugger;
            console.log('result', result);
            if (result) {
                //this.accountService.getMenu();
                //this.accountService.getPermissionId();
                this.dialogRef.close(true);
            }
        });*/

    }

    ngOnDestroy(): void {
        // if (this.isAuth$) this.loginSubscription.unsubscribe();
    }

    getErrorMessage(fc: FormControl) {
        return fc.hasError('required')
            ? 'Debe ingresar un valor. '
            : fc.hasError('email')
                ? 'Favor ingrese correctamente el email.'
                : '';
    }

    ConvertToLower(evt: any) {
        if (evt) this.fields['usuario'].setValue(evt.target.value.toLowerCase());
    }

    recover() {
        if (this.form.valid && this.form.value.email != null) {
            //this.store.dispatch(new UI.StartLoading());

            if (this.resetPasswordMode) {
                /*this.accountService.resetPassword(this.form.value).subscribe(
                    () => {
                        this.store.dispatch(new UI.StopLoading());
                        this.setLoginMode();

                        this.uiService.showSnackbar(
                            'Se ha cambiado exitosamente!',
                            'Cerrar',
                            5000
                        );
                    },
                    err => {
                        // debugger;
                        this.store.dispatch(new UI.StopLoading());
                        this.uiService.showSnackbar(
                            'Ocurrio un error. ' + err.message,
                            'Cerrar',
                            3000
                        );
                    }
                );*/
            } else {
                /*this.accountService
                    .recoverPassword(this.form.value.email)
                    .subscribe(
                        () => {
                            this.store.dispatch(new UI.StopLoading());
                            this.userName = this.form.value.email;
                            this.setResetPasswordMode();
                        },
                        err => {
                            // debugger;
                            this.store.dispatch(new UI.StopLoading());
                            this.uiService.showSnackbar(
                                'Ocurrio un error. ' + err.message,
                                'Cerrar',
                                3000
                            );
                        }
                    );*/
            }
        } else {
            /*this.uiService.showSnackbar(
                'Complete todos los datos',
                'Cerrar',
                3000
            );*/
        }
    }

    getMenu() {
        /*this.accountService.get_Menu().subscribe(
            (menu: Menu[]) => {
                // debugger;
                this.accountService.menu = menu;

                // Get permissions
                this.getPermissions();
            },
            () => {
                this.resetLoginData('Error al recuperar los datos de menú');
            }
        );*/
    }

    /*getPermissions() {
        this.accountService.get_PermissionId().subscribe(
            (permissions: PermissionId[]) => {
                this.accountService.permissions = permissions;
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Auth.SetAuthenticated());

                // joc 26/11/19 this.dismiss();
                this.dismiss(true);
                // joc 26/11/19 se debe redireccionar al returnUrl
                /*
                ya se redirecciona al cerrar dialogo
                this.route.queryParams.subscribe((params) => {
                  debugger;
                    if (params && params.returnUrl && params.returnUrl !== '')
                      this.router.navigate([params.returnUrl]);
                });*/
    /*       },
           () => {
               this.resetLoginData('Error al recuperar los datos de permisos');
           }
       );
   }*/

    resetLoginData(msg: string) {
        console.log(msg);
        localStorage.setItem('token', "");
        localStorage.setItem('expiration', "");
        //this.store.dispatch(new UI.StopLoading());
        //this.uiService.showSnackbar(msg, 'Cerrar', 3000);
    }

    loginSuccess(result: any) {
        // debugger;
        const expiration = new Date(
            new Date().getTime() + result.expires_in * 1000
        ).getTime();

        console.log(result);
        // Se localStorage values
        localStorage.setItem('token', result.token);
        localStorage.setItem('expiration', expiration.toString());
        //this.accountService.username = this.user.username;
        // joc 11/05/2020 
        localStorage.setItem('username', this.user.usuario);

        this.dismiss(true);

        //this.isAuth$ = true;

        // Get Companies
        // this.getCompanies();

        // Get menu
        // this.getMenu();

        // Combine process
        //Promise.all([this.getCompanies(), this.getMenu(), this.getUserInformation()]);
    }

    getCompanies() {
        console.log('request companies...');
        /*this.stockService.getCompanies(true).subscribe((companies: any) => {
            const payload = companies;
            const action = fromCompanys.AddCompanys(payload);
            this.store.dispatch(action);
            this.accountService.companyList = companies;
            console.log('companies request ok!');
        });*/
    }

    /*getUserInformation() {
        this.accountService.getCurrentUserAccount().subscribe(
            (user) => {
                // debugger;
                //console.log("Hola usuario: ", user);
                this.accountService.userid = user.id;
            }
        );
    }*/

    loginError(error: any) {

        console.log(error);

        localStorage.setItem('token', "");
        localStorage.setItem('expiration', "");
        //this.store.dispatch(new UI.StopLoading());

        //this.uiService.httpErr(error, true);
        /* joc 11/05/2020
        if (err.status === 400) {
          console.warn(err);
          this.uiService.showSnackbar(
            err.error ? err.error.error_description : 'Usuario y/o contraseña incorrectos',
            'Cerrar',
            3000
          );
    
        } else if (err.status === 0) {
          this.uiService.showSnackbar(
            'No hay conexión con el servidor',
            'Cerrar',
            3000
          );
        }*/
    }

    login() {

        //this.store.dispatch(new UI.StartLoading());
        this.user = this.form.value;
        console.log(this.form.value);
        //this.user.nombre = this.form.value.username;
        //this.user.clave = this.form.value.password;

        //console.log(this.user);
        this.usuarioService.signIn(this.user).subscribe(
            (result: any) => {
                console.log("Sucess..");
                console.log(result);
                if (result.ok) {
                    console.log("Logged");
                    console.log("token: ", result.token);
                    this.loginSuccess(result);
                } else {
                    console.log("Invalid Credentials");
                    this.loginError(result)
                }
            }, (error: any) => {
                console.log("Error..")
                console.log(error);
                this.loginError(error)
            }
        )
        /*this.accountService.postLogin(this.user).subscribe(
            (result: any) => this.loginSuccess(result),
            (error: any) => this.loginError(error)
        );*/
    }

    ok() {

        //console.log("ok");

        try {

            //this.uiService.hideSnackbar();

            if (this.recoverMode) {

                this.recover();

            } else {

                this.login();
            }

        } catch (err) {
            //this.store.dispatch(new UI.StopLoading());
        }
    }

    dismiss(result: boolean) {
        if (this.recoverMode) {
            if (this.resetPasswordMode) {
                this.setRecoverPasswordMode();
            } else {
                this.setLoginMode();
            }
        } else {
            this.dialogRef.close(result);
        }
    }

    openSnackBar(
        message: string,
        action: string
    ): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, action, {
            duration: 5000
        });
    }

    onKeydown(id: string, event: any) {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (this.recoverMode) {
                if (this.resetPasswordMode) {
                    if (
                        this.emailInput.nativeElement.value !== '' &&
                        this.passwordInput.nativeElement.value !== '' &&
                        this.codeInput.nativeElement.value !== ''
                    ) {
                        setTimeout(() => {
                            this.ok();
                        }, 0);
                    }
                } else {
                    if (id === 'email' && this.emailInput.nativeElement.value !== '') {
                        setTimeout(() => {
                            this.ok();
                        }, 0);
                    }
                }
            } else {
                if (
                    this.passwordInput.nativeElement.value !== '' &&
                    this.userNameInput.nativeElement.value !== ''
                ) {
                    setTimeout(() => {
                        this.ok();
                    }, 0);
                } else if (id === 'userName') {
                    setTimeout(() => {
                        this.passwordInput.nativeElement.focus();
                    }, 0);
                } /*else if (id === 'password') {
                    setTimeout(() => {
                        this.passwordInput.nativeElement.focus();
                    }, 0);
                }*/
            }

            return false;
        }
        return null;
    }

    setRecoverPasswordMode() {
        this.form = new FormGroup({
            email: new FormControl(this.userName, [
                Validators.required,
                Validators.email
            ])
        });
        this.fields = this.form.controls;
        this.okButtonTitle = 'Recuperar Password';
        this.resetPasswordMode = false;
        this.recoverMode = true;
        setTimeout(() => {
            this.emailInput.nativeElement.focus();
        }, 100);
    }

    setResetPasswordMode() {
        this.form = new FormGroup({
            email: new FormControl(this.userName, [
                Validators.required,
                Validators.email
            ]),
            code: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });
        this.fields = this.form.controls;
        this.okButtonTitle = 'Restablecer Password';
        this.recoverMode = true;
        this.resetPasswordMode = true;
    }

    setLoginMode() {
        this.form = new FormGroup({
            usuario: new FormControl(this.userName, [Validators.required]),
            clave: new FormControl('', [Validators.required])
        });
        this.fields = this.form.controls;
        this.okButtonTitle = 'Ingresar';
        this.resetPasswordMode = false;
        this.recoverMode = false;
    }

    ngAfterViewInit() {

        setTimeout(() => {
            if (this.userName != null && this.userName.length > 0) {
                this.passwordInput.nativeElement.focus();
                this.passwordInput.nativeElement.select();
                console.log('passwordInput');
            } else {
                this.userNameInput.nativeElement.focus();
            }

            // this.cd.detectChanges();

        }, 500);
    }
}
