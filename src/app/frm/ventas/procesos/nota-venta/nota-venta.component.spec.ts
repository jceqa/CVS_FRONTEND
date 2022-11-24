import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaVentaComponent } from './nota-venta.component';

describe('NotaVentaComponent', () => {
    let component: NotaVentaComponent;
    let fixture: ComponentFixture<NotaVentaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NotaVentaComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotaVentaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
