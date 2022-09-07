import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EntidadEmisoraService } from '../../../../services/entidademisora.service';
import { EntidadEmisora } from '../../../../models/entidadEmisora';
import { MatDialog } from '@angular/material/dialog';
import { EntidadEmisoraDialogComponent } from './entidademisora-dialog/entidademisora-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-entidademisora',
    templateUrl: './entidademisora.component.html',
    styleUrls: ['./entidademisora.component.css']
})
export class EntidadEmisoraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<EntidadEmisora>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    entidademisoras: EntidadEmisora[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private entidademisoraService: EntidadEmisoraService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarEntidadEmisoras();
    }

    cargarEntidadEmisoras() {
        this.entidademisoraService.getEntidadEmisoras().subscribe(
            (data) => {
                console.log(data);
                this.entidademisoras = data;

                this.dataSource = new MatTableDataSource<EntidadEmisora>(
                    this.entidademisoras
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

        const item = new EntidadEmisora();

        this.editItem(item);

    }

    editItem(item: EntidadEmisora): void {
        const dialogRef = this.dialog.open(EntidadEmisoraDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarEntidadEmisoras();
            }
        });
    }

    deleteItem(id: number): void {
        this.entidademisoraService.eliminarEntidadEmisora(id).subscribe(
            result => {
                console.log(result);
                this.cargarEntidadEmisoras();

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

    openDialog(event: any, entidademisora: EntidadEmisora): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Entidad Emisora",
                msg: "¿Está seguro que desea eliminar esta Entidad Emisora?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(entidademisora.id);
            }
        });
    }
}