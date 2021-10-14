import { Component, OnInit } from '@angular/core';
//import {AccountService} from '../../services/account.service';
//import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, /*Router*/ } from '@angular/router';
//import {UserRegisterComponent} from '../../../security/components/usuarios/user-register/user-register.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    returnUrl!: string;

    constructor(
        //public accountService: AccountService,
        //private dialog: MatDialog,
        private route: ActivatedRoute,
        //private router: Router
        ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        setTimeout(() => {
            //this.openRegisterDialog();
        }, 100);
    }

    /*(): void {
      const dialogRef = this.dialog.open(UserRegisterComponent, {
        width: '450px',
        panelClass: 'app-user-register-class',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(data => {
        if (data.result && this.returnUrl) {
          /** clobo 30/12/19 ver con Jose
           * En el componente Login esta comentado el router no se si agregar para tomar el queryParams
           * y como inicialmente toma username del localstorage seteé no mas desde acá.
           * */
    /*    this.router.navigate([`/login`], { queryParams: { username: data.email }});
        localStorage.setItem('username', data.email);
        console.log(this.returnUrl, data.email);
      } else {
        this.router.navigate(['/']);
      }
    });
  }*/
}
