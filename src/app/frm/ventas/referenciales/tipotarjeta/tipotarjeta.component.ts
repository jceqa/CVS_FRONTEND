import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TipoTarjetaService } from '../../../../services/tipotarjeta.service';
import { TipoTarjeta } from '../../../../models/tipotarjeta';
import { MatDialog } from '@angular/material/dialog';
import { TipoTarjetaDialogComponent } from './tipotarjeta-dialog/tipotarjeta-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-tipotarjeta',
    templateUrl: './tipotarjeta.component.html',
    styleUrls: ['./tipotarjeta.component.css']
})
export class TipoTarjetaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<TipoTarjeta>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    tipotarjetas: TipoTarjeta[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private tipotarjetaService: TipoTarjetaService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarTipoTarjetas();
    }

    cargarTipoTarjetas() {
        this.tipotarjetaService.getTipoTarjetas().subscribe(
            (data) => {
                console.log(data);
                this.tipotarjetas = data;

                this.dataSource = new MatTableDataSource<TipoTarjeta>(
                    this.tipotarjetas
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

        const item = new TipoTarjeta();

        this.editItem(item);

    }

    editItem(item: TipoTarjeta): void {
        const dialogRef = this.dialog.open(TipoTarjetaDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarTipoTarjetas();
            }
        });
    }

    deleteItem(id: number): void {
        this.tipotarjetaService.eliminarTipoTarjeta(id).subscribe(
            result => {
                console.log(result);
                this.cargarTipoTarjetas();

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

    openDialog(event: any, tipotarjeta: TipoTarjeta): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Tipo de Tarjeta",
                msg: "¿Está seguro que desea eliminar este tipo de tarjeta?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(tipotarjeta.id);
            }
        });
    }
}