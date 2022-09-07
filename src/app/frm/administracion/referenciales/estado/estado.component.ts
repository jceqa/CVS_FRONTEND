import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EstadoService } from '../../../../services/estado.service';
import { Estado } from '../../../../models/estado';
import { MatDialog } from '@angular/material/dialog';
import { EstadoDialogComponent } from './estado-dialog/estado-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-estado',
    templateUrl: './estado.component.html',
    styleUrls: ['./estado.component.css']
})
export class EstadoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<Estado>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    estados: Estado[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private estadoService: EstadoService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarEstados();
    }

    cargarEstados() {
        this.estadoService.getEstados().subscribe(
            (data) => {
                console.log(data);
                this.estados = data;

                this.dataSource = new MatTableDataSource<Estado>(
                    this.estados
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

        const item = new Estado();

        this.editItem(item);

    }

    editItem(item: Estado): void {
        const dialogRef = this.dialog.open(EstadoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarEstados();
            }
        });
    }

    deleteItem(id: number): void {
        this.estadoService.eliminarEstado(id).subscribe(
            result => {
                console.log(result);
                this.cargarEstados();

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

    openDialog(event: any, estado: Estado): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Estado",
                msg: "¿Está seguro que desea eliminar este Estado?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(estado.id);
            }
        });
    }
}