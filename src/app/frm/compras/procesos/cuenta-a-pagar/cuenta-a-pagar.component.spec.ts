import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaAPagarComponent } from './cuenta-a-pagar.component';

describe('CuentaAPagarComponent', () => {
  let component: CuentaAPagarComponent;
  let fixture: ComponentFixture<CuentaAPagarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaAPagarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaAPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
