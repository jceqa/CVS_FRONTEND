import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
//import { MatSnackBar } from '@angular/material/snack-bar';
//import { NotificadorService } from 'src/notificador.service';
import * as fromMenuOpen from './reducers/menuStatus.action';
import { LoginComponent } from './login_old/login.component';
import { LoginService } from './services/login.service';
import { Store } from '@ngrx/store';
import * as fromRoot from './app.reducer';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouteReuseStrategy, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'CVS';
    usuario = "Invitado";
    version: string = "1.0.2";
    appName: string = "CVS";
    message!: string;
    //estaLogueado = false;
    menus: any[] = [];
    data: any;
    isMenuOpen = true;
    flexibleToolBar = false;
    isDarkTheme: boolean;
    dir: string;
    isSmall: boolean;

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    constructor(public dialog: MatDialog,
        public loginService: LoginService,
        private store: Store<fromRoot.State>,
        private cd: ChangeDetectorRef,
        private router: Router,
        public routeStrat: RouteReuseStrategy
        //private data: NotificadorService,
       /* private snackbar: MatSnackBar*/) { }

    ngOnInit(): void {
        this.menus.push({ Name: "Menu1", Icon: null, Items: [{ Url: "/", Name: "Item 1" }, { Url: "/", Name: "Item 2" }, { Url: "/", Name: "Item 3" }] });
        this.menus.push({ Name: "Menu2", Icon: null, Items: [{ Url: "/", Name: "Item 1" }, { Url: "/", Name: "Item 2" }] });
        this.menus.push({ Name: "Menu3", Icon: null, Items: [{ Url: "/", Name: "Item 1" }] });

        this.isMenuOpen = this.loginService.IsMenuOpen;
        if (this.isMenuOpen) {
            this.openMenuAction();
        } else {
            this.closeMenuAction();
        }
    }

    openLogin(): void {
        const dialogRef = this.dialog.open(LoginComponent, {
            width: '40%',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            //console.log('Se cerro el modal');
        });
    }

    toogleSideNav() {
        this.sidenav.toggle();
        console.log(this.sidenav);
        this.closeMenuAction();
    }


    openMenuAction() {
        const menuOpenAction = new fromMenuOpen.OpenMenuAction();
        this.store.dispatch(menuOpenAction);
    }

    closeMenuAction() {
        const closeMenuAction = new fromMenuOpen.CloseMenuAction();
        this.store.dispatch(closeMenuAction);
    }

    toolBarCheck() {
        this.flexibleToolBar = !this.flexibleToolBar;
    }

    ngAfterViewChecked() {
        this.cd.detectChanges();
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    toggleDir() {
        this.dir = this.dir === 'ltr' ? 'rtl' : 'ltr';
    }

    go(url: string) {
        if (this.isSmall) {
            this.loginService.IsMenuOpen = false;
            this.sidenav.close();
        }
        this.router.navigate([url]);
    }

    closeMenu() {
        if (this.isSmall) {
            this.loginService.IsMenuOpen = false;
            this.sidenav.close();
        }
    }

    logout() {
        if (this.routeStrat['handlers']) {
            this.routeStrat['handlers'] = {};
        }

        this.loginService.logout();
        this.router.navigate(['/']);
    }

    getAnimationData(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData['animation']
        );
    }

    checkRouteBg() {
        switch (this.router.url) {
            case '/': {
                return true;
            }
            case '/login': {
                return true;
            }
            case '/register': {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    signOut() {
        localStorage.clear();
        this.usuario = "Invitado";
        //this.estaLogueado = false;
    }
}
