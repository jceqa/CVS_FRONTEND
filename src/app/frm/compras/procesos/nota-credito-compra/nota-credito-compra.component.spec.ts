import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaCreditoCompraComponent } from './nota-credito-compra.component';

describe('NotaCreditoCompraComponent', () => {
  let component: NotaCreditoCompraComponent;
  let fixture: ComponentFixture<NotaCreditoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaCreditoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaCreditoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
