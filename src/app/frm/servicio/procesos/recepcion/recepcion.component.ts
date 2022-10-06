import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {PedidoCompra} from '../../../../models/pedidoCompra';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {RecepcionService} from '../../../../services/recepcion.service';
import {RecepcionDialogComponent} from './recepcion-dialog/recepcion-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-recepcion',
    templateUrl: './recepcion.component.html',
    styleUrls: ['./recepcion.component.scss']
})
export class RecepcionComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'deposito', 'actions'];
    dataSource = new MatTableDataSource<Recepcion>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    recepcion: Recepcion[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private recepcionService: RecepcionService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.recepcionService.getRecepcion(this.all).subscribe(
            (data) => {
                console.log(data);
                this.recepcion = data;

                this.dataSource = new MatTableDataSource<PedidoCompra>(
                    this.recepcion
                );
                this.dataSource.paginator = this.paginator;
                // this.store.dispatch(new UI.StopLoading());
                // this.util.localStorageSetItem('loading', 'false');
                this.util.stopLoading();
            },
            err => {
                // this.store.dispatch(new UI.StopLoading());
                // this.util.localStorageSetItem('loading', 'false');
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

    add(): void {

        const item = new Recepcion();

        this.openDialog(item);

    }

    anular(dato: Recepcion): void {
        this.util.startLoading();
        this.recepcionService.anularRecepcion(dato).subscribe(
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

    anularDialog(event: any, recepcion: Recepcion): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Recepcion',
                msg: '¿Está seguro que desea anular esta Recepcion?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(recepcion);
            }
        });
    }

    openDialog(item: Recepcion): void {
        const dialogRef = this.dialog.open(RecepcionDialogComponent, {
            minWidth: '70%',
            // maxWidth: '600px',
            disableClose: true,
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
