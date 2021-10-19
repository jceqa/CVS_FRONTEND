import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../login/login-dialog/login-dialog.component';
import { LoginService } from '../services/login.service';


@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnChanges {
    inImgBase64: any = '';
    apkName = '';
    googlePlay = '';
    imageLoaded = false;
    constructor(
        public loginService: LoginService,
        private dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

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
