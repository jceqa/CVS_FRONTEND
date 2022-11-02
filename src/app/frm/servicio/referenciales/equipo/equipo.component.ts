import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Equipo } from '../../../../models/equipo';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from '../../../../services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { EquipoService } from '../../../../services/equipo.service';
import { EquipoDialogComponent } from './equipo-dialog/equipo-dialog.component';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-equipo',
    templateUrl: './equipo.component.html',
    styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'serie', 'modelo', 'marca', 'cliente', 'actions'];

    dataSource = new MatTableDataSource<Equipo>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    equipos: Equipo[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private equipoService: EquipoService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarEquipos();
    }

    cargarEquipos() {
        this.equipoService.listEquipos().subscribe(
            (data) => {
                console.log(data);
                this.equipos = data;

                this.dataSource = new MatTableDataSource<Equipo>(
                    this.equipos
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

        const item = new Equipo();

        this.editItem(item);

    }

    editItem(item: Equipo): void {
        const dialogRef = this.dialog.open(EquipoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarEquipos();
            }
        });
    }

    deleteItem(id: number): void {
        this.equipoService.eliminarEquipo(id).subscribe(
            result => {
                console.log(result);
                this.cargarEquipos();

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

    openDialog(event: any, equipo: Equipo): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Equipo",
                msg: "¿Está seguro que desea eliminar este equipo?"
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
