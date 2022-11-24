import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaVentaDialogComponent } from './nota-venta-dialog.component';

describe('NotaVentaDialogComponent', () => {
    let component: NotaVentaDialogComponent;
    let fixture: ComponentFixture<NotaVentaDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NotaVentaDialogComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotaVentaDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
