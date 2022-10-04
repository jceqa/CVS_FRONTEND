import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaRemisionComponent } from './nota-remision.component';

describe('NotaRemisionComponent', () => {
  let component: NotaRemisionComponent;
  let fixture: ComponentFixture<NotaRemisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaRemisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
