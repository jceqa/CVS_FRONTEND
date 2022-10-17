import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoServicioComponent } from './presupuesto-servicio.component';

describe('PresupuestoServicioComponent', () => {
    let component: PresupuestoServicioComponent;
    let fixture: ComponentFixture<PresupuestoServicioComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PresupuestoServicioComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PresupuestoServicioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
