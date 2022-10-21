import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {PresupuestoServicio} from '../../../../models/presupuestoServicio';
import {MatPaginator} from '@angular/material/paginator';
import {PresupuestoServicioService} from '../../../../services/presupuestoservicio.service';
import {PresupuestoServicioDialogComponent} from './presupuesto-servicio-dialog/presupuesto-servicio-dialog.component';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-presupuesto-servicio',
    templateUrl: './presupuesto-servicio.component.html',
    styleUrls: ['./presupuesto-servicio.component.scss']
})
export class PresupuestoServicioComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'servicio', 'estado', 'total', 'actions'];
    dataSource = new MatTableDataSource<PresupuestoServicio>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    presupuestosServicio: PresupuestoServicio[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private presupuestoServicioService: PresupuestoServicioService,
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
            this.presupuestoServicioService.getPresupuestosServicio(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.presupuestosServicio = data;
                    this.dataSource = new MatTableDataSource<PresupuestoServicio>(
                        this.presupuestosServicio
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
            this.presupuestoServicioService.getPresupuestosServicioPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.presupuestosServicio = data;
                    this.dataSource = new MatTableDataSource<PresupuestoServicio>(
                        this.presupuestosServicio
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
        const item = new PresupuestoServicio();
        this.openDialog(item);
    }

    anular(dato: PresupuestoServicio): void {
        this.util.startLoading();
        this.presupuestoServicioService.anularPresupuestoServicio(dato).subscribe(
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

    anularDialog(event: any, presupuestoServicio: PresupuestoServicio): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Presupuesto Servicio',
                msg: '¿Está seguro que desea anular este Presupuesto de Servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(presupuestoServicio);
            }
        });
    }

    openDialog(item: PresupuestoServicio): void {
        const dialogRef = this.dialog.open(PresupuestoServicioDialogComponent, {
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
