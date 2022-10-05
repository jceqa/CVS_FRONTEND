import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionDialogComponent } from './recepcion-dialog.component';

describe('RecepcionDialogComponent', () => {
    let component: RecepcionDialogComponent;
    let fixture: ComponentFixture<RecepcionDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RecepcionDialogComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecepcionDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
