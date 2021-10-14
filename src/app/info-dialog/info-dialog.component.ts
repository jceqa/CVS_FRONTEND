import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
//import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
  connectTypeField: FormControl;

  // declaración de Variables
  connectType: string;
  // Declaración de suscripciones
  getConnectTypeSubscription: Subscription;

  constructor(
    //private utilService: UtilService,
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // this.connectType = 'hola';
    //this.getConectType();
    this.connectTypeField = new FormControl();
  }

  /*getConectType() {
    this.getConnectTypeSubscription = this.utilService
      .getConnectType()
      .subscribe(result => {
        if (result) {
          this.connectType = result.toString();
        }
      });
  }*/

  ok() {
    this.dismiss();
  }

  dismiss() {
    this.dialogRef.close(null);
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
