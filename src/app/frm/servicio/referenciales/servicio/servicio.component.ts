import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Servicio} from '../../../../models/servicio';
import {MatPaginator} from '@angular/material/paginator';
import {UIService} from '../../../../services/ui.service';
import {MatDialog} from '@angular/material/dialog';
import {ServicioService} from '../../../../services/servicio.service';
import {ServicioDialogComponent} from './servicio-dialog/servicio-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-servicio',
    templateUrl: './servicio.component.html',
    styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'monto', 'impuesto', 'actions'];

    dataSource = new MatTableDataSource<Servicio>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    servicios: Servicio[] = [];

    pagina = 1;
    numeroResultados = 5;
    all = false;

    constructor(
        private servicioService: ServicioService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargarServicios();
    }

    cargarServicios() {
        this.servicioService.listServicios(this.all).subscribe(
            (data) => {
                console.log(data);
                this.servicios = data;

                this.dataSource = new MatTableDataSource<Servicio>(
                    this.servicios
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

        const item = new Servicio();

        this.editItem(item);

    }

    editItem(item: Servicio): void {
        const dialogRef = this.dialog.open(ServicioDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarServicios();
            }
        });
    }

    deleteItem(id: number): void {
        this.servicioService.eliminarServicio(id).subscribe(
            result => {
                console.log(result);
                this.cargarServicios();

                this.uiService.showSnackbar(
                    'Eliminado correctamente.',
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

    reactivateItem(servicio: Servicio): void {
        servicio.estado = 'ACTIVO';
        this.servicioService.editarServicio(servicio).subscribe(
            result => {
                console.log(result);
                this.cargarServicios();
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

    delete(event: any, servicio: Servicio): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Servicio',
                msg: '¿Está seguro que desea eliminar este servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(servicio.id);
            }
        });
    }

    reactivate(event: any, servicio: Servicio): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Servicio',
                msg: '¿Está seguro que desea reactivar este servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(servicio);
            }
        });
    }
}
