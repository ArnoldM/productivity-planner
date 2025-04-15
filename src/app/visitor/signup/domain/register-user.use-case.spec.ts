import { TestBed } from '@angular/core/testing';

import { RegisterUserUseCase } from './register-user.use-case';
import {
  AuthenticationService,
  RegisterPayload,
  RegisterResponse,
} from '@core/ports/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';
import { User, Visitor } from '@core/entities/user.interface';
import { faker } from '@faker-js/faker';
import { of } from 'rxjs';
import { EmailAlreadyTakenError } from '@visitor/signup/domain/email-already-taken.error';

describe('RegisterUserUseCase', () => {
  let service: RegisterUserUseCase;
  let authenticationService: jest.Mocked<AuthenticationService>;
  let userService: jest.Mocked<UserService>;
  let userStore: jest.Mocked<{ load: jest.Mock }>;
  let router: jest.Mocked<Router>;
  let visitor: Visitor;

  beforeEach(() => {
    // mock localStorage
    const localStorageMock = (function () {
      let store: Record<string, string> = {};

      return {
        getItem: (key: string): string | null => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    visitor = {
      name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: { register: jest.fn(), login: jest.fn() },
        },
        {
          provide: UserService,
          useValue: { create: jest.fn() },
        },
        {
          provide: UserStore,
          useValue: { load: jest.fn() },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    });
    service = TestBed.inject(RegisterUserUseCase);
    authenticationService = TestBed.inject(
      AuthenticationService,
    ) as jest.Mocked<AuthenticationService>;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    userStore = TestBed.inject(UserStore) as unknown as jest.Mocked<{ load: jest.Mock }>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    let registerResponse: RegisterResponse;

    beforeEach(() => {
      registerResponse = {
        jwtToken: faker.string.uuid(),
        jwtRefreshToken: faker.string.uuid(),
        expiresIn: '3600',
        userId: faker.string.uuid(),
      } as RegisterPayload;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call authenticationService.register with email and password', async () => {
      authenticationService.register.mockReturnValue(of(registerResponse));
      userService.create.mockReturnValue(of(undefined));

      await service.execute(visitor);

      expect(authenticationService.register).toHaveBeenCalledWith(visitor.email, visitor.password);
    });
    it('should throw an EmailAlreadyTakenError if the email is already taken', async () => {
      const registerResponse = new EmailAlreadyTakenError(visitor.email);
      const errorMessage = `Email ${visitor.email} is already taken. Please try another one.`;

      authenticationService.register.mockReturnValue(of(registerResponse));

      await expect(async () => await service.execute(visitor)).rejects.toThrow(errorMessage);
    });
    it('should set jwtToken in local storage', async () => {
      const setItemSpy = jest.spyOn(localStorage, 'setItem');

      authenticationService.register.mockReturnValue(of(registerResponse));
      userService.create.mockReturnValue(of(undefined));

      await service.execute(visitor);

      expect(setItemSpy).toHaveBeenCalledWith(
        'jwtToken',
        (registerResponse as RegisterPayload).jwtToken,
      );
    });
    it('should call userService.create with the user and jwtToken', async () => {
      const user: User = {
        id: (registerResponse as RegisterPayload).userId,
        email: visitor.email,
        name: visitor.name,
      };
      authenticationService.register.mockReturnValue(of(registerResponse));
      userService.create.mockReturnValue(of(undefined));

      await service.execute(visitor);

      expect(userService.create).toHaveBeenCalledWith(
        user,
        (registerResponse as RegisterPayload).jwtToken,
      );
    });
    it('should call userStore.register with the user', async () => {
      const user: User = {
        id: (registerResponse as RegisterPayload).userId,
        email: visitor.email,
        name: visitor.name,
      };
      authenticationService.register.mockReturnValue(of(registerResponse));
      userService.create.mockReturnValue(of(undefined));

      await service.execute(visitor);

      expect(userStore.load).toHaveBeenCalledWith(user);
    });
    it('should navigate to the dashboard', async () => {
      authenticationService.register.mockReturnValue(of(registerResponse));
      userService.create.mockReturnValue(of(undefined));

      await service.execute(visitor);

      expect(router.navigate).toHaveBeenCalledWith(['/', 'dashboard']);
    });
  });
});
