import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoCompraDialogComponent } from './presupuesto-compra-dialog.component';

describe('PresupuestoCompraDialogComponent', () => {
  let component: PresupuestoCompraDialogComponent;
  let fixture: ComponentFixture<PresupuestoCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
