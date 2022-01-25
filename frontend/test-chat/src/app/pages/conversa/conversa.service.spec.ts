import { TestBed } from '@angular/core/testing';

import { ConversaService } from './conversa.service';

describe('ConversaService', () => {
  let service: ConversaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
