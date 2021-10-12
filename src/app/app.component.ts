import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificadorService } from 'src/notificador.service';
import { LoginComponent } from './login_old/login.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'CVS';

    usuario = "Invitado";

    message!: string;

    estaLogueado = false;

    menus : any[] = [];

    constructor(public dialog: MatDialog,
        private data: NotificadorService,
        private snackbar: MatSnackBar) { }

    ngOnInit(): void {

        if (localStorage.getItem('username') !== null) {
            this.usuario = JSON.stringify(localStorage.getItem('username') || "");
            //this.usuario = this.usuario.replace(/['"]+/g, '');
            this.estaLogueado = true;
            console.log(this.estaLogueado);
        }

        this.data.currentMessage.subscribe(
            message => {
                this.message = message;
                if (this.message === "logueado") {
                    this.usuario = JSON.stringify(localStorage.getItem('username') || "");
                    //this.usuario = this.usuario.replace(/['"]+/g, '');
                    this.estaLogueado = true;
                    console.log(this.estaLogueado);
                }
            }
        )

        this.menus.push({Name : "Menu1", Icon : null});
        this.menus.push({Name : "Menu2", Icon : null});
        this.menus.push({Name : "Menu3", Icon : null});
    }

    openLogin(): void {
        const dialogRef = this.dialog.open(LoginComponent, {
            width: '40%',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            //console.log('Se cerro el modal');
        });
    }

    signOut() {
        localStorage.clear();
        this.usuario = "Invitado";
        this.estaLogueado = false;
    }
}
