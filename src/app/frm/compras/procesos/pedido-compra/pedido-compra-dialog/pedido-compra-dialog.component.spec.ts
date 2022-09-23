import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoCompraDialogComponent } from './pedido-compra-dialog.component';

describe('PedidoCompraDialogComponent', () => {
  let component: PedidoCompraDialogComponent;
  let fixture: ComponentFixture<PedidoCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
