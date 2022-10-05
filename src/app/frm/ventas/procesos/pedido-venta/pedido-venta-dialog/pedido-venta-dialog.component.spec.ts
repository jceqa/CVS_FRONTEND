import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoVentaDialogComponent } from './pedido-venta-dialog.component';

describe('PedidoVentaDialogComponent', () => {
    let component: PedidoVentaDialogComponent;
    let fixture: ComponentFixture<PedidoVentaDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PedidoVentaDialogComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PedidoVentaDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
