import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MarcaService } from '../../../../services/marca.service';
import { Marca } from '../../../../models/marca';
import { MatDialog } from '@angular/material/dialog';
import { MarcaDialogComponent } from './marca-dialog/marca-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-marca',
    templateUrl: './marca.component.html',
    styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<Marca>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    marcas: Marca[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private marcaService: MarcaService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarMarcas();
    }

    cargarMarcas() {
        this.marcaService.getMarcas().subscribe(
            (data) => {
                console.log(data);
                this.marcas = data;

                this.dataSource = new MatTableDataSource<Marca>(
                    this.marcas
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

        const item = new Marca();

        this.editItem(item);

    }

    editItem(item: Marca): void {
        const dialogRef = this.dialog.open(MarcaDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarMarcas();
            }
        });
    }

    deleteItem(id: number): void {
        this.marcaService.eliminarMarca(id).subscribe(
            result => {
                console.log(result);
                this.cargarMarcas();

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

    openDialog(event: any, marca: Marca): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Marca",
                msg: "¿Está seguro que desea eliminar esta marca?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(marca.id);
            }
        });
    }
}