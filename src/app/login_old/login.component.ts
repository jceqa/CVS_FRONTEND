import { Component, Inject, OnInit } from '@angular/core';
import { Router } from  '@angular/router';
import { Usuario } from  '../models/usuario';
import { AuthService } from  '../auth/auth.service';
import { AppComponent } from '../app.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificadorService } from 'src/notificador.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message! : string;

  constructor(private authService: AuthService, 
              private router: Router,
              public dialogRef: MatDialogRef<AppComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notif: NotificadorService) 
              { }

  usuarioIncorrecto = false;

  usuario : Usuario = new Usuario();

  ngOnInit(): void {
    this.notif.currentMessage.subscribe(message => this.message = message)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  signIn(){
    console.log(this.usuario);
    this.authService.signIn(this.usuario).subscribe(data => {
      this.usuarioIncorrecto = false;
      this.newMessage("logueado");
      localStorage.setItem('ACCESS_TOKEN', data.access);
      localStorage.setItem('REFRESH_TOKEN', data.refresh);
      localStorage.setItem('USER_NAME', this.usuario.username);
      this.dialogRef.close();
    }, 
    error => {
      console.error('There was an error!', error);
      this.usuarioIncorrecto = true;
    });
  }

  newMessage(msg : string) {
    this.notif.changeMessage(msg)
  }

}
