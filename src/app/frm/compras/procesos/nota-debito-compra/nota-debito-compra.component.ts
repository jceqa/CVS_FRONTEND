import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {NotaDebitoCompra} from '../../../../models/notaDebitoCompra';
import {MatPaginator} from '@angular/material/paginator';
import {NotaDebitoCompraService} from '../../../../services/notadebitocompra.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {NotaDebitoCompraDialogComponent} from './nota-debito-compra-dialog/nota-debito-compra-dialog.component';
import {MatSort} from '@angular/material/sort';
import {Pago} from '../../../../models/pago';

@Component({
    selector: 'app-nota-debito-compra',
    templateUrl: './nota-debito-compra.component.html',
    styleUrls: ['./nota-debito-compra.component.scss']
})
export class NotaDebitoCompraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fechaVencimiento', 'estado', 'monto', 'actions'];
    dataSource = new MatTableDataSource<NotaDebitoCompra>();

    @ViewChild('MatPaginator')
    paginator!: MatPaginator;
    @ViewChild('MatSort')
    matSort: MatSort;

    facturasCompra: NotaDebitoCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private notaDebitoCompraService: NotaDebitoCompraService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        if ( this.all) {
            this.notaDebitoCompraService.getNotasDebitoCompra(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.facturasCompra = data;
                    this.dataSource = new MatTableDataSource<NotaDebitoCompra>(
                        this.facturasCompra
                    );
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sortingDataAccessor = (item, property) => {
                        switch (property) {
                            case 'fechaVencimiento': return item.cuentaAPagar.fechaVencimiento;
                            default: return item[property];
                        }
                    };
                    this.dataSource.sort = this.matSort;
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
            this.notaDebitoCompraService.getNotaDebitoCompraPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.facturasCompra = data;
                    this.dataSource = new MatTableDataSource<NotaDebitoCompra>(
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
        const item = new NotaDebitoCompra();
        this.openDialog(item);
    }

    anular(dato: NotaDebitoCompra): void {
        this.util.startLoading();
        this.notaDebitoCompraService.anularNotaDebitoCompra(dato).subscribe(
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

    anularDialog(event: any, notaDebitoCompra: NotaDebitoCompra): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Factura Compra',
                msg: '¿Está seguro que desea anular esta Factura de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(notaDebitoCompra);
            }
        });
    }

    openDialog(item: NotaDebitoCompra): void {
        const dialogRef = this.dialog.open(NotaDebitoCompraDialogComponent, {
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

    procesarDialog(event: any, notaDebitoCompra: NotaDebitoCompra): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Procesar Nota de Debito de Compra',
                msg: '¿Está seguro que desea procesar esta Nota de Debito de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.procesar(notaDebitoCompra);
            }
        });
    }

    generatePago(dato: NotaDebitoCompra): NotaDebitoCompra {
        const pago = new Pago();
        pago.id = 0;
        pago.descripcion = 'PAGO GENERADO PARA NOTA DE DEBITO NRO: ' + dato.id;
        pago.fecha = new Date();
        pago.estado = 'ACTIVO';
        pago.monto = dato.monto;

        dato.cuentaAPagar.pago = pago;
        return dato;
    }

    procesar(dato: NotaDebitoCompra): void {
        this.util.startLoading();
        dato = this.generatePago(dato);
        this.notaDebitoCompraService.processNotaDebitoCompra(dato).subscribe(
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
}
