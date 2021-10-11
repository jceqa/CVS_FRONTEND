import { TestBed } from '@angular/core/testing';

import { CriticaService } from './critica.service';

describe('CriticaService', () => {
  let service: CriticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
