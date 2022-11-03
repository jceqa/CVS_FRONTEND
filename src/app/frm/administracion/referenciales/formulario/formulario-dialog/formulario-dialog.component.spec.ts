import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDialogComponent } from './formulario-dialog.component';

describe('FormularioDialogComponent', () => {
  let component: FormularioDialogComponent;
  let fixture: ComponentFixture<FormularioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
