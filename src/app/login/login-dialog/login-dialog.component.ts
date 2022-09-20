import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import * as fromRoot from '../../app.reducer';
import {UtilService} from '../../services/util.service';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit, AfterViewInit {

    isLoading$!: Observable<boolean>;
    invalidLogin!: boolean;
    errorMsg!: string;
    user: Usuario;
    hidePwd!: boolean;
    recoverMode = false;
    resetPasswordMode = false;
    okButtonTitle = 'Ingresar';

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
        private dialogRef: MatDialogRef<LoginDialogComponent>,
        private usuarioService: UsuarioService,
        private snackBar: MatSnackBar,
        private store: Store<fromRoot.State>,
        private util: UtilService
    ) { }

    ngOnInit() {
        this.invalidLogin = false;
        this.hidePwd = true;
        this.isLoading$ = this.store.select(fromRoot.getIsLoading);
        this.setLoginMode();
    }

    ConvertToLower(evt: any) {
        if (evt) this.fields['usuario'].setValue(evt.target.value.toLowerCase());
    }

    loginSuccess(result: any) {
        const expiration = new Date(
            new Date().getTime() + result.expires_in * 1000
        ).getTime();
        console.log(result);
        localStorage.setItem('token', result.token);
        localStorage.setItem('expiration', expiration.toString());
        this.util.startLoading();
        this.usuarioService.getUserByToken(result.token).subscribe( data => {
            console.log(data);
            localStorage.setItem('username', data.usuario);
            localStorage.setItem('userid', data.id.toString());
            this.util.stopLoading();
        }, (error: any) => {
            console.log('Error..');
            console.log(error);
            this.loginError(error);
            this.util.stopLoading();
        });

        this.dismiss(true);
    }

    loginError(error: any) {
        console.log(error);
        localStorage.setItem('token', '');
        localStorage.setItem('expiration', '');
    }

    login() {
        // this.store.dispatch(new UI.StartLoading());
        this.util.startLoading();
        this.user = this.form.value;
        console.log(this.form.value);
        // this.user.nombre = this.form.value.username;
        // this.user.clave = this.form.value.password;
        // console.log(this.user);
        this.usuarioService.signIn(this.user).subscribe(
            (result: any) => {
                console.log('Sucess..');
                console.log(result);
                if (result.ok) {
                    console.log('Logged');
                    console.log('token: ', result.token);
                    this.loginSuccess(result);
                } else {
                    console.log('Invalid Credentials');
                    this.loginError(result);
                }
                this.util.stopLoading();
            }, (error: any) => {
                console.log('Error..');
                console.log(error);
                this.loginError(error);
                this.util.stopLoading();
            }
        );
        /*this.accountService.postLogin(this.user).subscribe(
            (result: any) => this.loginSuccess(result),
            (error: any) => this.loginError(error)
        );*/
    }

    ok() {
        // console.log("ok");
        try {
            // this.uiService.hideSnackbar();
            if (this.recoverMode) {
                this.recover();
            } else {
                this.login();
            }
        } catch (err) {
            // this.store.dispatch(new UI.StopLoading());
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

    recover() {
        if (this.form.valid && this.form.value.email != null) {
            // this.store.dispatch(new UI.StartLoading());
            if (this.resetPasswordMode) {
                /*this.accountService.resetPassword(this.form.value).subscribe(
                    () => {
                        this.store.dispatch(new UI.StopLoading());
                        this.setLoginMode();
                        this.uiService.showSnackbar('Se ha cambiado exitosamente!','Cerrar',5000);
                    },
                    err => {
                        // debugger;
                        this.store.dispatch(new UI.StopLoading());
                        this.uiService.showSnackbar('Ocurrio un error. ' + err.message,'Cerrar',3000);
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

    resetLoginData(msg: string) {
        console.log(msg);
        localStorage.setItem('token', '');
        localStorage.setItem('expiration', '');
        // this.store.dispatch(new UI.StopLoading());
        // this.uiService.showSnackbar(msg, 'Cerrar', 3000);
    }

    getErrorMessage(fc: FormControl) {
        return fc.hasError('required')
            ? 'Debe ingresar un valor. '
            : fc.hasError('email')
                ? 'Favor ingrese correctamente el email.'
                : '';
    }
}
