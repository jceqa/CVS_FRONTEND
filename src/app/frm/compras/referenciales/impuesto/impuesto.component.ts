import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ImpuestoService } from '../../../../services/impuesto.service';
import { Impuesto } from '../../../../models/impuesto';
import { MatDialog } from '@angular/material/dialog';
import { ImpuestoDialogComponent } from './impuesto-dialog/impuesto-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-impuesto',
    templateUrl: './impuesto.component.html',
    styleUrls: ['./impuesto.component.css']
})
export class ImpuestoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<Impuesto>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    impuestos: Impuesto[] = [];

    pagina = 1;
    numeroResultados = 5;
    all = false;
    constructor(
        private impuestoService: ImpuestoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarImpuestos();
    }

    cargarImpuestos() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.impuestoService.getImpuestos(this.all).subscribe(
            (data) => {
                console.log(data);
                this.impuestos = data;

                this.dataSource = new MatTableDataSource<Impuesto>(
                    this.impuestos
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

    addItem(): void {

        const item = new Impuesto();

        this.editItem(item);

    }

    editItem(item: Impuesto): void {
        const dialogRef = this.dialog.open(ImpuestoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarImpuestos();
            }
        });
    }

    deleteItem(id: number): void {
        this.impuestoService.eliminarImpuesto(id).subscribe(
            result => {
                console.log(result);
                this.cargarImpuestos();

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

    reactivateItem(impuesto: Impuesto): void {
        impuesto.estado = 'ACTIVO';
        this.impuestoService.editarImpuesto(impuesto).subscribe(
            result => {
                console.log(result);
                this.cargarImpuestos();
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

    delete(event: any, impuesto: Impuesto): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Impuesto',
                msg: '¿Está seguro que desea eliminar este Impuesto?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(impuesto.id);
            }
        });
    }

    reactivate(event: any, impuesto: Impuesto): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Impuesto',
                msg: '¿Está seguro que desea reactivar este impuesto?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(impuesto);
            }
        });
    }
}
