import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroCompraDialogComponent } from './libro-compra-dialog.component';

describe('LibroCompraDialogComponent', () => {
  let component: LibroCompraDialogComponent;
  let fixture: ComponentFixture<LibroCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibroCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibroCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
