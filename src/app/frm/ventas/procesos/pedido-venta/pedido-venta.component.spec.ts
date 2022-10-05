import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoVentaComponent } from './pedido-venta.component';

describe('PedidoVentaComponent', () => {
    let component: PedidoVentaComponent;
    let fixture: ComponentFixture<PedidoVentaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PedidoVentaComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PedidoVentaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
