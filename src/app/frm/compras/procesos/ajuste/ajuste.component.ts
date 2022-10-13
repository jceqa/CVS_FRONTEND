import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Ajuste} from '../../../../models/ajuste';
import {MatPaginator} from '@angular/material/paginator';
import {AjusteService} from '../../../../services/ajuste.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {AjusteDialogComponent} from './ajuste-dialog/ajuste-dialog.component';
@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.scss']
})
export class AjusteComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'estado', 'fecha', 'articulo', 'actions'];

    dataSource = new MatTableDataSource<Ajuste>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    ajustes: Ajuste[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private ajusteService: AjusteService,
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
            this.ajusteService.getAjustes(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.ajustes = data;
                    this.dataSource = new MatTableDataSource<Ajuste>(
                        this.ajustes
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
                });
        } else {
            this.ajusteService.listAjustesPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.ajustes = data;
                    this.dataSource = new MatTableDataSource<Ajuste>(
                        this.ajustes
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
                });
        }
    }

    add(): void {
        const item = new Ajuste();
        this.openDialog(item);
    }

    openDialog(item: Ajuste): void {
        const dialogRef = this.dialog.open(AjusteDialogComponent, {
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

    anular(dato: Ajuste): void {
        this.util.startLoading();
        this.ajusteService.anularAjuste(dato).subscribe(
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

    anularDialog(event: any, ajuste: Ajuste): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Ajuste',
                msg: '¿Está seguro que desea anular este Ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(ajuste);
            }
        });
    }

    procesar(dato: Ajuste): void {
        this.util.startLoading();
        this.ajusteService.processAjuste(dato).subscribe(
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

    procesarDialog(event: any, ajuste: Ajuste): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Procesar Ajuste',
                msg: '¿Está seguro que desea procesar este Ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.procesar(ajuste);
            }
        });
    }
}
