import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioDialogComponent } from './usuario-dialog.component';

describe('UsuarioDialogComponent', () => {
  let component: UsuarioDialogComponent;
  let fixture: ComponentFixture<UsuarioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
