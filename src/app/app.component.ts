import {Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewChecked} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as fromMenuOpen from './reducers/menuStatus.action';
import {LoginService} from './services/login.service';
import {Store} from '@ngrx/store';
import * as fromRoot from './app.reducer';
import {MatSidenav} from '@angular/material/sidenav';
import {Router, RouteReuseStrategy} from '@angular/router';
import {UsuarioRolService} from './services/usuariorol.service';
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
                            this.generarMenu();
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

    generarMenu() {
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

        this.menus.forEach(menu => {
            menu.Items = menu.Items.sort( (a, b) => {
               return (a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
            });

            menu.Items.forEach(item => {
              item.SubItems = item.SubItems.sort( (a, b) => {
                  return (a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
              });
           });
        });

        this.menus = this.menus.sort( (a, b) => {
           return (a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
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

    ngAfterViewChecked() {
        this.cd.detectChanges();
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    toggleDir() {
        this.dir = this.dir === 'ltr' ? 'rtl' : 'ltr';
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
}
