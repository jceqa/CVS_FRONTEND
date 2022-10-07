import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroCompraComponent } from './libro-compra.component';

describe('LibroCompraComponent', () => {
  let component: LibroCompraComponent;
  let fixture: ComponentFixture<LibroCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibroCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibroCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
