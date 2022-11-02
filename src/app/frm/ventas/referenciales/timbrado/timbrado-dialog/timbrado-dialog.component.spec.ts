import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbradoDialogComponent } from './timbrado-dialog.component';

describe('TimbradoDialogComponent', () => {
  let component: TimbradoDialogComponent;
  let fixture: ComponentFixture<TimbradoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimbradoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimbradoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
