import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Cliente} from '../../../../models/cliente';
import {MatDialog} from '@angular/material/dialog';
import {ClienteDialogComponent} from './cliente-dialog/cliente-dialog.component';
import {UIService} from '../../../../services/ui.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {ClienteService} from '../../../../services/cliente.service';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

    displayedColumns: string[] = ['id', 'ruc', 'razon', 'direccion', 'correo', 'telefono', 'ciudad', 'actions'];

    dataSource = new MatTableDataSource<Cliente>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    clientes: Cliente[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private clienteService: ClienteService,
        private dialog: MatDialog,
        private uiService: UIService,
        private utils: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes() {
        this.utils.startLoading();
        this.clienteService.getClientes().subscribe(
            (data) => {
                console.log(data);
                this.clientes = data;
                this.utils.stopLoading();
                this.dataSource = new MatTableDataSource<Cliente>(
                    this.clientes
                );
                this.dataSource.paginator = this.paginator;
            },
            err => {
                console.log(err.error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    addItem(): void {

        const item = new Cliente();

        this.editItem(item);

    }

    editItem(item: Cliente): void {
        const dialogRef = this.dialog.open(ClienteDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarClientes();
            }
        });
    }

    deleteItem(id: number): void {
        this.utils.startLoading();
        this.clienteService.eliminarCliente(id).subscribe(
            result => {
                console.log(result);
                this.cargarClientes();
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Eliminado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    openDialog(event: any, cliente: Cliente): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Cliente',
                msg: '¿Está seguro que desea eliminar este Cliente?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(cliente.id);
            }
        });
    }
}
