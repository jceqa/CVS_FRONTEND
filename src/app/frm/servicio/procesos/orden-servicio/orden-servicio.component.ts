import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {OrdenServicio} from '../../../../models/ordenServicio';
import {OrdenServicioDialogComponent} from './orden-servicio-dialog/orden-servicio-dialog.component';
import {OrdenServicioService} from '../../../../services/ordenservicio.service';

@Component({
    selector: 'app-orden-servicio',
    templateUrl: './orden-servicio.component.html',
    styleUrls: ['./orden-servicio.component.scss']
})
export class OrdenServicioComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'proveedor', 'estado', 'total', 'actions'];
    dataSource = new MatTableDataSource<OrdenServicio>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    ordenServicios: OrdenServicio[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private ordenServicioService: OrdenServicioService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        if (this.all) {
            this.ordenServicioService.getOrdenesServicio(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.ordenServicios = data;
                    this.dataSource = new MatTableDataSource<OrdenServicio>(
                        this.ordenServicios
                    );
                    this.dataSource.paginator = this.paginator;
                    this.util.stopLoading();
                },
                err => {
                    this.util.stopLoading();
                    console.log(err.error);
                    this.uiService.showSnackbar(
                        'Ha ocurrido un error.',
                        'Cerrar',
                        3000
                    );
                }
            );
        } else {
            this.ordenServicioService.getOrdenServicioPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.ordenServicios = data;
                    this.dataSource = new MatTableDataSource<OrdenServicio>(
                        this.ordenServicios
                    );
                    this.dataSource.paginator = this.paginator;
                    this.util.stopLoading();
                },
                err => {
                    this.util.stopLoading();
                    console.log(err.error);
                    this.uiService.showSnackbar(
                        'Ha ocurrido un error.',
                        'Cerrar',
                        3000
                    );
                }
            );
        }
    }

    add(): void {
        const item = new OrdenServicio();
        this.openDialog(item);
    }

    anular(dato: OrdenServicio): void {
        this.util.startLoading();
        this.ordenServicioService.anularOrdenServicio(dato).subscribe(
            result => {
                console.log(result);
                this.cargar();
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Anulado correctamente.',
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

    anularDialog(event: any, ordenServicio: OrdenServicio): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Orden deServicio',
                msg: '¿Está seguro que desea anular esta Orden de Servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(ordenServicio);
            }
        });
    }

    openDialog(item: OrdenServicio): void {
        const dialogRef = this.dialog.open(OrdenServicioDialogComponent, {
            minWidth: '70%',
            // maxWidth: '600px',
            disableClose: true,
            autoFocus: false,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // debugger;
            if (result) {
                this.cargar();
            }
        });
    }
}
