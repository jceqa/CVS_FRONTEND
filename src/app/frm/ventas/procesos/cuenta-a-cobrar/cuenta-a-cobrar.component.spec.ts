import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaACobrarComponent } from './cuenta-a-cobrar.component';

describe('CuentaACobrarComponent', () => {
  let component: CuentaACobrarComponent;
  let fixture: ComponentFixture<CuentaACobrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaACobrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaACobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
