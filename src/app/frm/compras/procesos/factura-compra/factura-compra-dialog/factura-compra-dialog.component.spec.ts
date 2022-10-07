import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCompraDialogComponent } from './factura-compra-dialog.component';

describe('FacturaCompraDialogComponent', () => {
  let component: FacturaCompraDialogComponent;
  let fixture: ComponentFixture<FacturaCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
