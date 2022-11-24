import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {EntregaEquipoService} from '../../../../services/entregaequipo.service';
import {EntregaEquipoDialogComponent} from './entrega-equipo-dialog/entrega-equipo-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {EntregaEquipo} from '../../../../models/entregaEquipo';

@Component({
    selector: 'app-entrega-equipo',
    templateUrl: './entrega-equipo.component.html',
    styleUrls: ['./entrega-equipo.component.scss']
})
export class EntregaEquipoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', /*'sucursal',*/ 'actions'];
    dataSource = new MatTableDataSource<EntregaEquipo>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    entregaEquipo: EntregaEquipo[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private entregaEquipoService: EntregaEquipoService,
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
            this.entregaEquipoService.getEntregaEquipos(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.entregaEquipo = data;
                    this.dataSource = new MatTableDataSource<EntregaEquipo>(
                        this.entregaEquipo
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
            this.entregaEquipoService.getEntregaEquiposPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.entregaEquipo = data;
                    this.dataSource = new MatTableDataSource<EntregaEquipo>(
                        this.entregaEquipo
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

        const item = new EntregaEquipo();

        this.openDialog(item);

    }

    anular(dato: EntregaEquipo): void {
        this.util.startLoading();
        this.entregaEquipoService.anularEntregaEquipo(dato).subscribe(
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

    anularDialog(event: any, entregaEquipo: EntregaEquipo): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular EntregaEquipo',
                msg: '¿Está seguro que desea anular esta EntregaEquipo?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(entregaEquipo);
            }
        });
    }

    openDialog(item: EntregaEquipo): void {
        const dialogRef = this.dialog.open(EntregaEquipoDialogComponent, {
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
