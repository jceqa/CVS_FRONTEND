import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoCompraComponent } from './presupuesto-compra.component';

describe('PresupuestoCompraComponent', () => {
  let component: PresupuestoCompraComponent;
  let fixture: ComponentFixture<PresupuestoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
