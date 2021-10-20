import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
    connectTypeField: FormControl;

    connectType: string;

    constructor(
        private dialogRef: MatDialogRef<InfoDialogComponent>,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.connectTypeField = new FormControl();
    }

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
