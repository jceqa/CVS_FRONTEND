import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ImpuestoService } from '../../../../services/impuesto.service';
import { Impuesto } from '../../../../models/impuesto';
import { MatDialog } from '@angular/material/dialog';
import { ImpuestoDialogComponent } from './impuesto-dialog/impuesto-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

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

    constructor(
        private impuestoService: ImpuestoService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarImpuestos();
    }

    cargarImpuestos() {
        this.impuestoService.getImpuestos().subscribe(
            (data) => {
                console.log(data);
                this.impuestos = data;

                this.dataSource = new MatTableDataSource<Impuesto>(
                    this.impuestos
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
        )
    }

    openDialog(event: any, impuesto: Impuesto): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Impuesto",
                msg: "¿Está seguro que desea eliminar este impuesto?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(impuesto.id);
            }
        });
    }
}