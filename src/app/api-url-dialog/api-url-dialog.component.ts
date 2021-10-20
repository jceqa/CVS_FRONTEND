import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-api-url-dialog',
    templateUrl: './api-url-dialog.component.html',
    styleUrls: ['./api-url-dialog.component.scss']
})
export class ApiUrlDialogComponent implements OnInit {
    url: FormControl;

    constructor(
        private dialogRef: MatDialogRef<ApiUrlDialogComponent>,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
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
