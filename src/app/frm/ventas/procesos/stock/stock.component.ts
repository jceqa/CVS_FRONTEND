import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Stock} from '../../../../models/stock';
import {MatPaginator} from '@angular/material/paginator';
import {StockService} from '../../../../services/stock.service';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.sass']
})
export class StockComponent implements OnInit {

    displayedColumns: string[] = ['id', /*'sucursal',*/ 'deposito', 'articulo', 'existencia'];

    dataSource = new MatTableDataSource<Stock>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    stocks: Stock[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private stockService: StockService,
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
        this.stockService.getStocks(this.all).subscribe(
            (data) => {
                console.log(data);
                this.stocks = data;

                this.dataSource = new MatTableDataSource<Stock>(
                    this.stocks
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
