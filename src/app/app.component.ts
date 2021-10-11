import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificadorService } from 'src/notificador.service';
import { LoginComponent } from './login_old/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'SPA';
  
  usuario = "Invitado";

  message! : string;

  estaLogueado = false;

  constructor(public dialog: MatDialog,
              private data: NotificadorService){}

  ngOnInit(): void{

    if(localStorage.getItem('USER_NAME') !== null){
      this.usuario = JSON.stringify(localStorage.getItem('USER_NAME') || "");
      this.usuario = this.usuario.replace(/['"]+/g, '');
      this.estaLogueado = true;
    }

    this.data.currentMessage.subscribe(
      message => {
        this.message = message;
        if(this.message === "logueado"){
          this.usuario = JSON.stringify(localStorage.getItem('USER_NAME') || "");
          this.usuario = this.usuario.replace(/['"]+/g, '');
          this.estaLogueado = true;
        }
      }
    )
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

  signOut(){
    localStorage.clear();
    this.usuario = "Invitado";
    this.estaLogueado = false;
  }
}
