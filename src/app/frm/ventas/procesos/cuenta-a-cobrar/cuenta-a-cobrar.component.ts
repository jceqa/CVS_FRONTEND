import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {CuentaACobrar} from '../../../../models/cuentaACobrar';
import {MatPaginator} from '@angular/material/paginator';
import {CuentaACobrarService} from '../../../../services/cuentaacobrar.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
  CuentaACobrarDialogComponent
} from './cuenta-a-cobrar-dialog/cuenta-a-cobrar-dialog.component';
import {Cobro} from '../../../../models/cobro';

@Component({
  selector: 'app-cuenta-a-cobrar',
  templateUrl: './cuenta-a-cobrar.component.html',
  styleUrls: ['./cuenta-a-cobrar.component.scss']
})
export class CuentaACobrarComponent implements OnInit {

  displayedColumns: string[] = ['id', 'fechaVencimiento', 'estado', 'monto', 'cuota', 'actions'];
  dataSource = new MatTableDataSource<CuentaACobrar>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  facturasCompra: CuentaACobrar[] = [];

  pagina = 1;
  numeroResultados = 5;

  all = false;

  constructor(
      private cuentaACobrarService: CuentaACobrarService,
      private dialog: MatDialog,
      private uiService: UIService,
      private util: UtilService
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.util.startLoading();
    if (this.all) {
      this.cuentaACobrarService.getCuentasACobrar(this.all).subscribe(
          (data) => {
            console.log(data);
            this.facturasCompra = data;
            this.dataSource = new MatTableDataSource<CuentaACobrar>(
                this.facturasCompra
            );
            this.dataSource.paginator = this.paginator;
            this.util.stopLoading();
          },
          err => {
            this.util.stopLoading();
            console.log(err.error);
            this.uiService.showSnackbar(
                'Ha ocurrido un error.',
                'Cerrar',
                3000
            );
          }
      );
    } else {
      this.cuentaACobrarService.getCuentasACobrarPendientes().subscribe(
          (data) => {
            console.log(data);
            this.facturasCompra = data;
            this.dataSource = new MatTableDataSource<CuentaACobrar>(
                this.facturasCompra
            );
            this.dataSource.paginator = this.paginator;
            this.util.stopLoading();
          },
          err => {
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
  }

  add(): void {

    const item = new CuentaACobrar();

    this.openDialog(item);

  }

  anular(dato: CuentaACobrar): void {
    this.util.startLoading();
    this.cuentaACobrarService.anularCuentaACobrar(dato).subscribe(
        result => {
          console.log(result);
          this.cargar();
          this.util.stopLoading();
          this.uiService.showSnackbar(
              'Anulado correctamente.',
              'Cerrar',
              3000
          );
        }, error => {
          console.log(error);
          this.util.stopLoading();
          this.uiService.showSnackbar(
              'Ha ocurrido un error.',
              'Cerrar',
              3000
          );
        }
    );
  }

  anularDialog(event: any, cuentaACobrar: CuentaACobrar): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // width: '50vw',
      data: {
        title: 'Anular Factura Compra',
        msg: '¿Está seguro que desea anular esta Factura de Compra?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.data) {
        this.anular(cuentaACobrar);
      }
    });
  }

  openDialog(item: CuentaACobrar): void {
    const dialogRef = this.dialog.open(CuentaACobrarDialogComponent, {
      minWidth: '70%',
      // maxWidth: '600px',
      disableClose: true,
      autoFocus: false,
      data: {
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // debugger;
      if (result) {
        this.cargar();
      }
    });
  }

    procesarDialog(event: any, cuentaACobrar: CuentaACobrar): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Procesar Cuenta a Cobrar',
                msg: '¿Está seguro que desea procesar esta Cuenta a Cobrar?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.procesar(cuentaACobrar);
            }
        });
    }

    procesar(dato: CuentaACobrar): void {
        this.util.startLoading();
        dato = this.generateCobro(dato);
        this.cuentaACobrarService.processCuentaACobrar(dato).subscribe(
            result => {
                console.log(result);
                this.cargar();
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Procesado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    error.error ? error.error : 'Ha ocurrido un error',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    generateCobro(dato: CuentaACobrar): CuentaACobrar {
        const cobro = new Cobro();
        cobro.id = 0;
        cobro.descripcion = 'COBRO GENERADO PARA CUENTA A COBRAR NRO: ' + dato.id;
        cobro.fecha = new Date();
        cobro.estado = 'ACTIVO';
        cobro.monto = dato.monto;

        dato.cobro = cobro;
        return dato;
    }
}
