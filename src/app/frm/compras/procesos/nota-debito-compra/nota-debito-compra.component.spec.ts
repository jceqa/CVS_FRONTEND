import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDebitoCompraComponent } from './nota-debito-compra.component';

describe('NotaDebitoCompraComponent', () => {
  let component: NotaDebitoCompraComponent;
  let fixture: ComponentFixture<NotaDebitoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaDebitoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaDebitoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
