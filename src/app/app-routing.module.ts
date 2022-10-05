import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RegisterComponent } from './register/register.component';
import { CustomRouteReuseStrategy } from './services/CustomRouteReuseStrategy';
import { MarcaComponent } from './frm/compras/referenciales/marca/marca.component';
import { EquipoComponent } from './frm/servicio/referenciales/equipo/equipo.component';
import { CiudadComponent } from './frm/compras/referenciales/ciudad/ciudad.component';
import { ImpuestoComponent } from './frm/compras/referenciales/impuesto/impuesto.component';
import { TipoArticuloComponent } from './frm/compras/referenciales/tipoArticulo/tipoArticulo.component';
import { CargoComponent } from './frm/administracion/referenciales/cargo/cargo.component';
import { EstadoComponent } from './frm/administracion/referenciales/estado/estado.component';
import {ArticuloComponent} from './frm/compras/referenciales/articulo/articulo.component';
import {TipoTarjetaComponent} from './frm/ventas/referenciales/tipotarjeta/tipotarjeta.component';
import {ProveedorComponent} from './frm/compras/referenciales/proveedor/proveedor.component';
import {PedidoCompraComponent} from './frm/compras/procesos/pedido-compra/pedido-compra.component';
import {PresupuestoCompraComponent} from './frm/compras/procesos/presupuesto-compra/presupuesto-compra.component';
import {OrdenCompraComponent} from './frm/compras/procesos/orden-compra/orden-compra.component';
import {ClienteComponent} from './frm/administracion/referenciales/cliente/cliente.component';
import {PedidoVentaComponent} from './frm/ventas/procesos/pedido-venta/pedido-venta.component';

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'marca', component: MarcaComponent },
    { path: 'equipo', component: EquipoComponent },
    { path: 'ciudad', component: CiudadComponent },
    { path: 'impuesto', component: ImpuestoComponent },
    { path: 'tipoarticulo', component: TipoArticuloComponent },
    { path: 'cargo', component: CargoComponent },
    { path: 'estado', component: EstadoComponent },
    { path: 'impuesto', component: ImpuestoComponent },
    { path: 'articulo', component: ArticuloComponent},
    { path: 'tipotarjeta', component: TipoTarjetaComponent},
    { path: 'proveedor', component: ProveedorComponent},
    { path: 'pedidocompra', component: PedidoCompraComponent},
    { path: 'presupuestocompra', component: PresupuestoCompraComponent},
    { path: 'ordencompra', component: OrdenCompraComponent},
    { path: 'cliente', component: ClienteComponent},
    { path: 'pedidoventa', component: PedidoVentaComponent},
    { path: '', component: MainContentComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    providers: [
        { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
