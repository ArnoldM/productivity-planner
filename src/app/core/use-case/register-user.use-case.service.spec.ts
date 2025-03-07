import { TestBed } from '@angular/core/testing';

import { RegisterUserUseCaseService } from './register-user.use-case.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { UserService } from '@core/repositories/user.service';

describe('RegisterUserUseCaseService', () => {
  let service: RegisterUserUseCaseService;
  let mockAuthService: jest.Mocked<AuthenticationService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockAuthService = {
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthenticationService>;

    mockUserService = {
      create: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    TestBed.configureTestingModule({
      providers: [
        RegisterUserUseCaseService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    });
    service = TestBed.inject(RegisterUserUseCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
