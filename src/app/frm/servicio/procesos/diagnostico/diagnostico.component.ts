import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {Diagnostico} from '../../../../models/diagnostico';
import {DiagnosticoDialogComponent} from './diagnostico-dialog/diagnostico-dialog.component';
import {DiagnosticoService} from '../../../../services/diagnostico.service';

@Component({
    selector: 'app-diagnostico',
    templateUrl: './dianostico.component.html',
    styleUrls: ['./diagnostico.component.scss']
})
export class DiagnosticoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'proveedor', 'estado', 'total', 'actions'];
    dataSource = new MatTableDataSource<Diagnostico>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    diagnosticos: Diagnostico[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private diagnosticoService: DiagnosticoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        if (this.all) {
            this.diagnosticoService.getDiagnostico(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.diagnostico = data;
                    this.dataSource = new MatTableDataSource<Diagnostico>(
                        this.diagnostico
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
            this.diagnosticoService.getDiagnosticoPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.diagnosticos = data;
                    this.dataSource = new MatTableDataSource<Diagnostico>(
                        this.diagnostico
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
        const item = new Diagnostico();
        this.openDialog(item);
    }

    anular(dato: Diagnostico): void {
        this.util.startLoading();
        this.diagnosticoService.anularDiagnostico(dato).subscribe(
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

    anularDialog(event: any, diagnostico: Diagnostico): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Diagnostico',
                msg: '¿Está seguro que desea anular este Diagnostico?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(diagnostico);
            }
        });
    }

    openDialog(item: Diagnostico): void {
        const dialogRef = this.dialog.open(DiagnosticoDialogComponent, {
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
