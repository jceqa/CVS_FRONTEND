import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoEquipoDialogComponent } from './diagnostico-equipo-dialog.component';

describe('DiagnosticoEquipoDialogComponent', () => {
  let component: DiagnosticoEquipoDialogComponent;
  let fixture: ComponentFixture<DiagnosticoEquipoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticoEquipoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticoEquipoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
