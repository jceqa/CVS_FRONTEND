import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as fromMenuOpen from './reducers/menuStatus.action';
import { LoginService } from './services/login.service';
import { Store } from '@ngrx/store';
import * as fromRoot from './app.reducer';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouteReuseStrategy, RouterOutlet } from '@angular/router';
import { TokenService } from './services/token.service';
import { UsuarioRolService } from './services/usuariorol.service';
import { PermisoService } from './services/permiso.service';

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

    menus: any[] = [];
    data: any;
    isMenuOpen = true;
    flexibleToolBar = false;
    isDarkTheme: boolean;
    dir: string;
    isSmall: boolean;

    token: string;
    userId: number;
    rolId: number;

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    constructor(public dialog: MatDialog,
        public loginService: LoginService,
        private store: Store<fromRoot.State>,
        private cd: ChangeDetectorRef,
        private router: Router,
        public routeStrat: RouteReuseStrategy,
        private tokenService: TokenService,
        private usuarioRolService: UsuarioRolService,
        private permisoService: PermisoService) { }

    ngOnInit(): void {
        //this.menus.push({ Name: "Menu1", Icon: null, Items: [{ Name: "Item 1", SubItems: [{ Url: "/", Name: "Sub Item 1" }] }, { Url: "/", Name: "Item 2" }, { Url: "/", Name: "Item 3" }] });
        //this.menus.push({ Name: "Menu2", Icon: null, Items: [{ Url: "/", Name: "Item 1" }, { Url: "/", Name: "Item 2" }] });
        //this.menus.push({ Name: "Menu3", Icon: null, Items: [{ Url: "/", Name: "Item 1" }] });

        this.token = localStorage.getItem('token');
        this.tokenService.getUser(this.token).subscribe(
            result => {
                console.log(result);
                this.userId = result.id

                this.usuarioRolService.getRolesByUserId(this.userId).subscribe(
                    roles => {
                        console.log(roles);
                        this.rolId = roles[0].id_rol;
                        this.permisoService.getPermisosByRolId(this.rolId).subscribe(
                            permisos => {
                                console.log(permisos);
                                this.generarMenu(permisos);
                            }
                        )
                    },
                    error => {
                        console.log(error);
                    }
                )
            },
            error => {
                console.log(error);
            }
        )


        this.isMenuOpen = this.loginService.IsMenuOpen;
        if (this.isMenuOpen) {
            this.openMenuAction();
        } else {
            this.closeMenuAction();
        }
    }

    generarMenu(permisos: any[]) {
        let sistema = permisos[0].id_sistema;
        let subMenu = permisos[0].id_sub_menu;
        let sistemas = [];
        let submenus = [];
        let formularios = [];
        let anteriorMenu = "";
        let anteriorSubMenu = "";
        permisos.forEach(element => {
            if (element.id_sub_menu === subMenu && element.id_sistema === sistema) {
                formularios.push({
                    Name: element.nombre_formulario,
                    Url: element.url_formulario
                });
                anteriorSubMenu = element.nombre_sub_menu;
                anteriorMenu = element.nombre_sistema;
            } else if (element.id_sistema === sistema) {
                submenus.push({
                    Name: anteriorSubMenu,
                    SubItems: formularios.slice()
                });
                formularios.length = 0;
                subMenu = element.id_sub_menu;
                formularios.push({
                    Name: element.nombre_formulario,
                    Url: element.url_formulario
                });
                anteriorMenu = element.nombre_sistema
            } else {
                submenus.push({
                    Name: anteriorSubMenu,
                    SubItems: formularios.slice()
                });
                formularios.length = 0;
                sistemas.push({
                    Name: anteriorMenu,
                    Items: submenus.slice(),
                    Icon: null,
                });
                submenus.length = 0;
                formularios.push({
                    Name: element.nombre_formulario,
                    Url: element.url_formulario
                });
                subMenu = element.id_sub_menu;
                anteriorSubMenu = element.nombre_sub_menu;
                sistema = element.id_sistema;
            }
        });

        /*submenus.push({
            Name: anteriorSubMenu,
            SubItems: formularios.slice()
        });

        sistemas.push({
            Name: anteriorMenu,
            Items: submenus.slice(),
            Icon: null,
        });*/

        this.menus = sistemas;
        console.log(sistemas);
    }

    /*openLogin(): void {
        const dialogRef = this.dialog.open(LoginComponent, {
            width: '40%',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            //console.log('Se cerro el modal');
        });
    }*/

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
