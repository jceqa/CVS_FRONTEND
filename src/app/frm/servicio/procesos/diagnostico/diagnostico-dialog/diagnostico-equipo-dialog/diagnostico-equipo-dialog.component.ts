import {Component, Inject, OnInit} from '@angular/core';
import {ServicioService} from '../../../../../../services/servicio.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormType} from '../../../../../../models/enum';
import {Servicio} from '../../../../../../models/servicio';
import {UtilService} from '../../../../../../services/util.service';
@Component({
  selector: 'app-diagnostico-equipo-dialog',
  templateUrl: './diagnostico-equipo-dialog.component.html',
  styleUrls: ['./diagnostico-equipo-dialog.component.scss']
})
export class DiagnosticoEquipoDialogComponent implements OnInit {

    formType: FormType;
    servicios: Servicio[] = [];

    servicioSelected: Servicio[] = [];
    selected: Boolean[] = [];

    constructor(
        private dialogRef: MatDialogRef<DiagnosticoEquipoDialogComponent>,
        private servicioService: ServicioService,
        private utils: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            console.log(data);
            this.servicioSelected = data.item;
            this.formType = data.type;
        }
    }

    ngOnInit(): void {
        this.utils.startLoading();
        this.servicioService.listServicios().subscribe(data => {
            console.log(data);
            this.servicios = data;

            for (let i = 0; i < this.servicios.length; i++) {
                if (this.servicioSelected.find(s => s.id === this.servicios[i].id)) {
                    this.selected.push(true);
                } else {
                    this.selected.push(false);
                }
            }

            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    selectedNotaCredito($event): void {
        console.log($event.source._value);
        this.servicioSelected = $event.source._value;
    }

    ok(): void {
      this.add();
    }

    add(): void {
        this.dialogRef.close(this.servicioSelected);
    }
}
