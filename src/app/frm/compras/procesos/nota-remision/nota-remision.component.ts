import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {NotaRemision} from '../../../../models/notaRemision';
import {MatPaginator} from '@angular/material/paginator';
import {NotaRemisionService} from '../../../../services/notaremision.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {NotaRemisionDialogComponent} from './nota-remision-dialog/nota-remision-dialog.component';

@Component({
    selector: 'app-nota-remision',
    templateUrl: './nota-remision.component.html',
    styleUrls: ['./nota-remision.component.scss']
})
export class NotaRemisionComponent implements OnInit {


    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'origen', 'destino', 'tipo', 'actions'];
    dataSource = new MatTableDataSource<NotaRemision>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturasCompra: NotaRemision[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private notaRemisionService: NotaRemisionService,
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
            this.notaRemisionService.getNotasRemision(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.facturasCompra = data;

                    this.dataSource = new MatTableDataSource<NotaRemision>(
                        this.facturasCompra
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
            this.notaRemisionService.listNotaRemisionPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.facturasCompra = data;

                    this.dataSource = new MatTableDataSource<NotaRemision>(
                        this.facturasCompra
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

        const item = new NotaRemision();

        this.openDialog(item);

    }

    anular(dato: NotaRemision): void {
        this.util.startLoading();
        this.notaRemisionService.anularNotaRemision(dato).subscribe(
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

    anularDialog(event: any, notaRemision: NotaRemision): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Nota Remision',
                msg: '¿Está seguro que desea anular esta Nota de Remisión?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(notaRemision);
            }
        });
    }

    procesar(dato: NotaRemision): void {
        this.util.startLoading();
        this.notaRemisionService.processNotaRemision(dato).subscribe(
            result => {
                console.log(result);
                this.cargar();
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Procesado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    error.error ? error.error : 'Ha ocurrido un error',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    procesarDialog(event: any, notaRemision: NotaRemision): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Procesar Nota de Remisión',
                msg: '¿Está seguro que desea procesar esta Nota de Remisión?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.procesar(notaRemision);
            }
        });
    }

    openDialog(item: NotaRemision): void {
        const dialogRef = this.dialog.open(NotaRemisionDialogComponent, {
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
