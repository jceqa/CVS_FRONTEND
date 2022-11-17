import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Pago} from '../../../../models/pago';
import {MatPaginator} from '@angular/material/paginator';
import {PagoService} from '../../../../services/pago.service';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import print from 'print-js';

@Component({
  selector: 'app-reporte-pago',
  templateUrl: './reporte-pago.component.html',
  styleUrls: ['./reporte-pago.component.sass']
})
export class ReportePagoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'fecha', 'monto'];

    dataSource = new MatTableDataSource<Pago>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    pagos: Pago[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private pagoService: PagoService,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.pagoService.getPagos(this.all).subscribe(
            (data) => {
                console.log(data);
                this.pagos = data;

                this.dataSource = new MatTableDataSource<Pago>(
                    this.pagos
                );
                this.dataSource.paginator = this.paginator;
                // this.store.dispatch(new UI.StopLoading());
                // this.util.localStorageSetItem('loading', 'false');
                this.util.stopLoading();
            },
            err => {
                // this.store.dispatch(new UI.StopLoading());
                // this.util.localStorageSetItem('loading', 'false');
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
