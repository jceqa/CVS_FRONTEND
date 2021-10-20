import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    title: string;
    msg: string;
    submsg: string[];
    showOkButton: boolean;
    isOk: boolean;
    showCancelButton: boolean;
    isCancel: boolean;
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    _data: DialogData;
    showOkButton = true;
    showCancelButton = false;

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this._data = data as DialogData;
        if (this._data == null) {
            this._data.title = 'Confirmar';
            this._data.msg = 'Esta seguro que desea realizar esta operacion?';
        } else {
            // if (this._data.showOkButton)
            // this._data.showOkButton = true;
            if (this._data.showCancelButton) {
                this.showCancelButton = true;
                this.showOkButton = false;
            }
        }
    }

    onNoClick(): void {
        this._data.isOk = false;
        this.dialogRef.close({ data: this._data.isOk });
    }

    onYesClick(): void {
        this._data.isOk = true;
        this.dialogRef.close({ data: this._data.isOk });
    }

    onCancelClick(): void {
        this._data.isOk = false;
        this._data.isCancel = true;
        this.dialogRef.close({ data: this._data.isOk });
    }

}
