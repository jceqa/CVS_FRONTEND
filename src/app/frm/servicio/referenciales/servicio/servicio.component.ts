import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Servicio } from '../../../../models/servicio';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from '../../../../services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { ServicioService } from '../../../../services/servicio.service';
import { ServicioDialogComponent } from './servicio-dialog/servicio-dialog.component';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-servicio',
    templateUrl: './servicio.component.html',
    styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'monto'];

    dataSource = new MatTableDataSource<Servicio>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    servicios: Servicio[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private servicioService: ServicioService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.servicioService.listServicios().subscribe(
            (data) => {
                console.log(data);
                this.servicios = data;

                this.dataSource = new MatTableDataSource<Servicio>(
                    this.servicios
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

        const item = new Servicio();

        this.editItem(item);

    }

    editItem(item: Servicio): void {
        const dialogRef = this.dialog.open(ServicioDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargar();
            }
        });
    }

    deleteItem(id: number): void {
        this.servicioService.eliminarServicio(id).subscribe(
            result => {
                console.log(result);
                this.cargar();

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

    openDialog(event: any, equipo: Servicio): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Servicio',
                msg: '¿Está seguro que desea eliminar este Servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(equipo.id);
            }
        });
    }
}
