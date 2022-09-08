import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CondicionPagoService } from '../../../../services/condicionPago.service';
import { CondicionPago } from '../../../../models/condicionPago';
import { MatDialog } from '@angular/material/dialog';
import { CondicionPagoDialogComponent } from './condicionPago-dialog/condicionPago-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-condicion-pago',
    templateUrl: './condicionPago.component.html',
    styleUrls: ['./condicionPago.component.css']
})
export class CondicionPagoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<CondicionPago>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    condicionpagos: CondicionPago[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private condicionpagoService: CondicionPagoService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarCondicionPagos();
    }

    cargarCondicionPagos() {
        this.condicionpagoService.getCondicionPagos().subscribe(
            (data) => {
                console.log(data);
                this.condicionpagos = data;

                this.dataSource = new MatTableDataSource<CondicionPago>(
                    this.condicionpagos
                );
                this.dataSource.paginator = this.paginator;
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

        const item = new CondicionPago();

        this.editItem(item);

    }

    editItem(item: CondicionPago): void {
        const dialogRef = this.dialog.open(CondicionPagoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarCondicionPagos();
            }
        });
    }

    deleteItem(id: number): void {
        this.condicionpagoService.eliminarCondicionPago(id).subscribe(
            result => {
                console.log(result);
                this.cargarCondicionPagos();

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
        )
    }

    openDialog(event: any, condicionpago: CondicionPago): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar condicion de pago",
                msg: "¿Está seguro que desea eliminar esta condicion de pago?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(condicionpago.id);
            }
        });
    }
}
