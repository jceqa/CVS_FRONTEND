import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Proveedor} from '../../../../models/proveedor';
import {MatDialog} from '@angular/material/dialog';
import {ProveedorDialogComponent} from './proveedor-dialog/proveedor-dialog.component';
import {UIService} from '../../../../services/ui.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {ProveedorService} from '../../../../services/proveedor.service';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-proveedor',
    templateUrl: './proveedor.component.html',
    styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

    displayedColumns: string[] = ['id', 'ruc', 'razon', 'direccion', 'correo', 'telefono', 'ciudad', 'actions'];

    dataSource = new MatTableDataSource<Proveedor>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    proveedores: Proveedor[] = [];

    pagina = 1;
    numeroResultados = 5;
    all = false;

    constructor(
        private proveedorService: ProveedorService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargarProveedores();
    }

    cargarProveedores() {
        this.util.startLoading();
        this.proveedorService.getProveedores(this.all).subscribe(
            (data) => {
                console.log(data);
                this.proveedores = data;
                this.dataSource = new MatTableDataSource<Proveedor>(
                    this.proveedores
                );
                this.dataSource.paginator = this.paginator;
                this.util.stopLoading();
            },
            err => {
                console.log(err.error);
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    addItem(): void {

        const item = new Proveedor();

        this.editItem(item);

    }

    editItem(item: Proveedor): void {
        const dialogRef = this.dialog.open(ProveedorDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarProveedores();
            }
        });
    }

    deleteItem(id: number): void {
        this.util.startLoading();
        this.proveedorService.eliminarProveedor(id).subscribe(
            result => {
                console.log(result);
                this.cargarProveedores();
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Eliminado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    reactivateItem(proveedor: Proveedor): void {
        proveedor.estado = 'ACTIVO';
        this.proveedorService.editarProveedor(proveedor).subscribe(
            result => {
                console.log(result);
                this.cargarProveedores();
                this.uiService.showSnackbar(
                    'Reactivado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);

                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    delete(event: any, proveedor: Proveedor): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Proveedor',
                msg: '¿Está seguro que desea eliminar este proveedor?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(proveedor.id);
            }
        });
    }

    reactivate(event: any, proveedor: Proveedor): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Proveedor',
                msg: '¿Está seguro que desea reactivar este Proveedor?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(proveedor);
            }
        });
    }
}
