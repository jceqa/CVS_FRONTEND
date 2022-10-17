import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoServicioDialogComponent } from './presupuesto-servicio-dialog.component';

describe('PresupuestoServicioDialogComponent', () => {
    let component: PresupuestoServicioDialogComponent;
    let fixture: ComponentFixture<PresupuestoServicioDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PresupuestoServicioDialogComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PresupuestoServicioDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
