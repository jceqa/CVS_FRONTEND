import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouteReuseStrategy, Router } from '@angular/router';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { LoginDialogComponent } from '../login/login-dialog/login-dialog.component';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as fromMenuOpen from '../reducers/menuStatus.action';
import { LoginService } from '../services/login.service';
import { ApiUrlDialogComponent } from '../api-url-dialog/api-url-dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    // Declaración de variables de Evento
    @Output() toggleSidenav: EventEmitter<void>;
    @Output() toggleTheme: EventEmitter<void>;
    @Output() toggleDir: EventEmitter<void>;
    // companyName: string;
    isMenuOpen!: boolean;
    username = localStorage.getItem('username');

    constructor(
        public routeStrat: RouteReuseStrategy,
        public loginService: LoginService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router,
        private store: Store<fromRoot.State>,
    ) {
        this.toggleSidenav = new EventEmitter<void>();
        this.toggleTheme = new EventEmitter<void>();
        this.toggleDir = new EventEmitter<void>();
        /*this.store.select('company').subscribe( company => {
          this.companyName = company.name;
        });*/
        this.store.select('menuOpen').subscribe(menuOpen => {
            this.isMenuOpen = menuOpen;
        });
    }

    public menuOpenClick() {
        this.loginService.IsMenuOpen = !this.loginService.IsMenuOpen;
        this.toggleSidenav.emit();
        if (this.loginService.IsMenuOpen) {
            this.openMenuAction();
        } else {
            this.closeMenuAction();
        }
    }

    public logout() {
        if (this.routeStrat['handlers']) {
            this.routeStrat['handlers'] = {};
        }
        this.loginService.logout();
        this.router.navigate(['/']);
    }

    openMenuAction() {
        const menuOpenAction = new fromMenuOpen.OpenMenuAction();
        this.store.dispatch(menuOpenAction);
    }

    closeMenuAction() {
        const closeMenuAction = new fromMenuOpen.CloseMenuAction();
        this.store.dispatch(closeMenuAction);
    }


    openLoginDialog(): void {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '450px'
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.router.navigate(['/']);
            }
        });
    }

    /*openProfileDialog(): void {
        const dialogRef = this.dialog.open(UserProfileDialogComponent, {
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate(['/']);
            }
        });
    }*/

    openApiUrlConfDialog(): void {
        const dialogRef = this.dialog.open(ApiUrlDialogComponent, {
            width: '450px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate(['/']);
            }
        });
    }

    openInfoDialog(): void {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.router.navigate(['/']);
            }
        });
    }

    openSnackBar(
        message: string,
        action: string
    ): MatSnackBarRef<SimpleSnackBar> {
        return this.snackBar.open(message, action, {
            duration: 5000
        });
    }
}
