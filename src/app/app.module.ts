import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MainContentComponent} from './main-content/main-content.component';
import {LoginPageComponent} from './login/login-page/login-page.component';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {LoginDialogComponent} from './login/login-dialog/login-dialog.component';
import {MaterialModule} from './material.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {InfoDialogComponent} from './info-dialog/info-dialog.component';
import {MarcaComponent} from './frm/compras/referenciales/marca/marca.component';
import {MarcaDialogComponent} from './frm/compras/referenciales/marca/marca-dialog/marca-dialog.component';
import {UIService} from './services/ui.service';
import {UtilService} from './services/util.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {EquipoComponent} from './frm/servicio/referenciales/equipo/equipo.component';
import {EquipoDialogComponent} from './frm/servicio/referenciales/equipo/equipo-dialog/equipo-dialog.component';
import {AccountService} from './services/account.service';
import {CiudadComponent} from './frm/compras/referenciales/ciudad/ciudad.component';
import {CiudadDialogComponent} from './frm/compras/referenciales/ciudad/ciudad-dialog/ciudad-dialog.component';
import {ImpuestoComponent} from './frm/compras/referenciales/impuesto/impuesto.component';
import {ImpuestoDialogComponent} from './frm/compras/referenciales/impuesto/impuesto-dialog/impuesto-dialog.component';
import {TipoArticuloComponent} from './frm/compras/referenciales/tipoArticulo/tipoArticulo.component';
import {TipoArticuloDialogComponent} from './frm/compras/referenciales/tipoArticulo/tipoArticulo-dialog/tipoArticulo-dialog.component';
import {CargoComponent} from './frm/administracion/referenciales/cargo/cargo.component';
import {CargoDialogComponent} from './frm/administracion/referenciales/cargo/cargo-dialog/cargo-dialog.component';
import {EstadoComponent} from './frm/administracion/referenciales/estado/estado.component';
import {EstadoDialogComponent} from './frm/administracion/referenciales/estado/estado-dialog/estado-dialog.component';
import {EntidadEmisoraComponent} from './frm/ventas/referenciales/entidademisora/entidademisora.component';
import {EntidadEmisoraDialogComponent} from './frm/ventas/referenciales/entidademisora/entidademisora-dialog/entidademisora-dialog.component';
import {CondicionPagoComponent} from './frm/ventas/referenciales/condicionPago/condicionPago.component';
import {CondicionPagoDialogComponent} from './frm/ventas/referenciales/condicionPago/condicionPago-dialog/condicionPago-dialog.component';
import {TipoTarjetaComponent} from './frm/ventas/referenciales/tipotarjeta/tipotarjeta.component';
import {TipoTarjetaDialogComponent} from './frm/ventas/referenciales/tipotarjeta/tipotarjeta-dialog/tipotarjeta-dialog.component';
import {ArticuloComponent} from './frm/compras/referenciales/articulo/articulo.component';
import {ArticuloDialogComponent} from './frm/compras/referenciales/articulo/articulo-dialog/articulo-dialog.component';
import {SucursalComponent} from './frm/administracion/referenciales/sucursal/sucursal.component';
import {SucursalDialogComponent} from './frm/administracion/referenciales/sucursal/sucursal-dialog/sucursal-dialog.component';
import {DepositoComponent} from './frm/administracion/referenciales/deposito/deposito.component';
import {DepositoDialogComponent} from './frm/administracion/referenciales/deposito/deposito-dialog/deposito-dialog.component';
import {ProveedorComponent} from './frm/compras/referenciales/proveedor/proveedor.component';
import {ProveedorDialogComponent} from './frm/compras/referenciales/proveedor/proveedor-dialog/proveedor-dialog.component';
import {MyCurrencyPipe} from './pipes/my-currency-pipe';
import {MyCurrencyFormatterDirective} from './directives/my-currency-formatter-directive';
import {PedidoCompraComponent} from './frm/compras/procesos/pedido-compra/pedido-compra.component';
import {
    PedidoCompraDialogComponent
} from './frm/compras/procesos/pedido-compra/pedido-compra-dialog/pedido-compra-dialog.component';
import {PresupuestoCompraComponent} from './frm/compras/procesos/presupuesto-compra/presupuesto-compra.component';
import {
    PresupuestoCompraDialogComponent
} from './frm/compras/procesos/presupuesto-compra/presupuesto-compra-dialog/presupuesto-compra-dialog.component';
import {OrdenCompraComponent} from './frm/compras/procesos/orden-compra/orden-compra.component';
import {
    OrdenCompraDialogComponent
} from './frm/compras/procesos/orden-compra/orden-compra-dialog/orden-compra-dialog.component';
import {ClienteComponent} from './frm/administracion/referenciales/cliente/cliente.component';
import {ClienteDialogComponent} from './frm/administracion/referenciales/cliente/cliente-dialog/cliente-dialog.component';
import {RecepcionDialogComponent} from './frm/servicio/procesos/recepcion/recepcion-dialog/recepcion-dialog.component';
import {PedidoVentaComponent} from './frm/ventas/procesos/pedido-venta/pedido-venta.component';
import {PedidoVentaDialogComponent} from './frm/ventas/procesos/pedido-venta/pedido-venta-dialog/pedido-venta-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        MainContentComponent,
        LoginPageComponent,
        LoginDialogComponent,
        ToolbarComponent,
        InfoDialogComponent,
        MarcaComponent,
        MarcaDialogComponent,
        ConfirmDialogComponent,
        EquipoComponent,
        EquipoDialogComponent,
        CiudadComponent,
        CiudadDialogComponent,
        ImpuestoDialogComponent,
        ImpuestoComponent,
        TipoArticuloComponent,
        TipoArticuloDialogComponent,
        CargoComponent,
        CargoDialogComponent,
        EstadoComponent,
        EstadoDialogComponent,
        CondicionPagoComponent,
        CondicionPagoDialogComponent,
        EntidadEmisoraComponent,
        EntidadEmisoraDialogComponent,
        TipoTarjetaComponent,
        TipoTarjetaDialogComponent,
        ArticuloComponent,
        ArticuloDialogComponent,
        SucursalComponent,
        SucursalDialogComponent,
        DepositoComponent,
        DepositoDialogComponent,
        ProveedorComponent,
        ProveedorDialogComponent,
        PedidoCompraComponent,
        PedidoCompraDialogComponent,
        PresupuestoCompraComponent,
        PresupuestoCompraDialogComponent,
        OrdenCompraComponent,
        OrdenCompraDialogComponent,
        ClienteComponent,
        ClienteDialogComponent,
        RecepcionDialogComponent,
        PedidoVentaComponent,
        PedidoVentaDialogComponent,

        MyCurrencyPipe,
        MyCurrencyFormatterDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}, {}),
        MaterialModule
    ],
    providers: [
        UIService,
        UtilService,
        AccountService,
        MyCurrencyPipe,
        MyCurrencyFormatterDirective
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
