import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenServicioDialogComponent } from './orden-servicio-dialog.component';

describe('OrdenServicioDialogComponent', () => {
    let component: OrdenServicioDialogComponent;
    let fixture: ComponentFixture<OrdenServicioDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OrdenServicioDialogComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrdenServicioDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
