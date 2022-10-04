import {Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewChecked} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as fromMenuOpen from './reducers/menuStatus.action';
import {LoginService} from './services/login.service';
import {Store} from '@ngrx/store';
import * as fromRoot from './app.reducer';
import {MatSidenav} from '@angular/material/sidenav';
import {Router, RouteReuseStrategy, RouterOutlet} from '@angular/router';
import {UsuarioRolService} from './services/usuariorol.service';
import {Permiso} from './models/permiso';
import {UtilService} from './services/util.service';
import {MenuService} from './services/menu.service';
import {Menu} from './models/menu';
import {UsuarioRol} from './models/usuarioRol';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {

    title = 'Innovalogic System';
    usuario = 'Invitado';
    version = '1.0.2';
    appName = 'Innovalogic System';
    message!: string;

    menu: Menu;

    menus: any[] = [];
    data: any;
    isMenuOpen = true;
    flexibleToolBar = false;
    isDarkTheme: boolean;
    dir: string;
    isSmall: boolean;

    token: string;
    userId: number;
    usuarioRol: UsuarioRol[];

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    constructor(public dialog: MatDialog,
                public loginService: LoginService,
                private store: Store<fromRoot.State>,
                private cd: ChangeDetectorRef,
                private router: Router,
                public routeStrat: RouteReuseStrategy,
                private usuarioRolService: UsuarioRolService,
                private util: UtilService,
                private menuService: MenuService
    ) {
    }

    ngOnInit(): void {
        this.util.localStorageSetItem('loading', 'false');
        this.token = localStorage.getItem('token');
        this.userId = this.util.getUserId();
        console.log('user id : ', this.userId);
        if (this.userId) {
            this.util.startLoading();
            this.menuService.getMenu().subscribe( data => {
                console.log(data);
                this.menu = data;
                    this.usuarioRolService.getByUserId(this.userId).subscribe(usuarioRol => {
                            console.log(usuarioRol);
                            this.usuarioRol = usuarioRol;
                            this.util.stopLoading();
                            this.generarMenu2();
                        },
                        error => {
                            this.util.stopLoading();
                            console.log(error);
                        }
                    );
            },
                error => {
                    this.util.stopLoading();
                    console.log(error);
                });
        }

        this.isMenuOpen = this.loginService.IsMenuOpen;

        if (this.isMenuOpen) {
            this.openMenuAction();
        } else {
            this.closeMenuAction();
        }
    }

    generarMenu2() {
        const newMenu = [];
        this.menu.sistemas.forEach(s =>
            newMenu.push({
                Icon : null,
                Name : s.nombre,
                Items: []
            })
        );

        newMenu.forEach(nm =>
            this.menu.subMenus.forEach(sm =>
                nm.Items.push({
                    Name : sm.nombre,
                    SubItems : []
                })

            )
        );

        this.usuarioRol.forEach(ur =>
            ur.permisos.forEach(p =>
                newMenu.find( nm => nm.Name === p.formulario.sistema.nombre).Items.
                    find(i => i.Name === p.formulario.subMenu.nombre).SubItems.
                push({
                    Url : p.formulario.url,
                    Name : p.formulario.nombre
                })
            )
        );

        console.log(newMenu);
        this.menus = newMenu;
    }

    generarMenu(permisos: Permiso[]) {
        let sistema = permisos[0].formulario.sistema.id;
        let subMenu = permisos[0].formulario.subMenu.id;
        const sistemas = [];
        const submenus = [];
        const formularios = [];
        let anteriorMenu = '';
        let anteriorSubMenu = '';
        permisos.forEach(element => {
            if (element.formulario.subMenu.id === subMenu && element.formulario.sistema.id === sistema) {
                formularios.push({
                    Name: element.formulario.nombre,
                    Url: element.formulario.url
                });

                anteriorSubMenu = element.formulario.subMenu.nombre;
                anteriorMenu = element.formulario.sistema.nombre;
            } else if (element.formulario.sistema.id === sistema) {
                submenus.push({
                    Name: anteriorSubMenu,
                    SubItems: formularios.slice()
                });
                formularios.length = 0;
                subMenu = element.formulario.subMenu.id;
                formularios.push({
                    Name: element.formulario.nombre,
                    Url: element.formulario.url
                });
                anteriorMenu = element.formulario.sistema.nombre;
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
                    Name: element.formulario.nombre,
                    Url: element.formulario.url
                });
                subMenu = element.formulario.subMenu.id;
                anteriorSubMenu = element.formulario.subMenu.nombre;
                sistema = element.formulario.sistema.id;
            }
        })
        ;

        submenus.push({
            Name: anteriorSubMenu,
            SubItems: formularios.slice()
        });

        sistemas.push({
            Name: anteriorMenu,
            Items: submenus.slice(),
            Icon: null,
        });

        this.menus = sistemas;
        console.log(sistemas);
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
        this.usuario = 'Invitado';
        // this.estaLogueado = false;
    }
}
