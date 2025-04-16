import { TestBed } from '@angular/core/testing';

import { LoginUserUseCase } from './login-user.use-case';
import { AuthenticationService, LoginPayload } from '@core/ports/authentication.service';
import { UserService } from '@core/ports/user.service';
import { UserStore } from '@core/stores/user.store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { User } from '@core/entities/user.interface';
import { InvalidCredentialError } from '@visitor/login/domain/invalid-credential.error';
import { APP_ROUTES } from '@core/models/enums/routes.enum';

describe('LoginUserUseCase', () => {
  let service: LoginUserUseCase;
  let authenticationService: jest.Mocked<AuthenticationService>;
  let userService: jest.Mocked<UserService>;
  let userStore: jest.Mocked<{ load: jest.Mock }>;
  let router: jest.Mocked<Router>;

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

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: { register: jest.fn(), login: jest.fn() },
        },
        {
          provide: UserService,
          useValue: { fetch: jest.fn() },
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
    service = TestBed.inject(LoginUserUseCase);
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
    let loginResponse: LoginPayload;
    let user: User;

    beforeEach(() => {
      loginResponse = {
        jwtToken: faker.string.uuid(),
        jwtRefreshToken: faker.string.uuid(),
        expiresIn: faker.string.uuid(),
        userId: faker.string.uuid(),
        isRegistered: true,
      };
      user = {
        email: faker.internet.email(),
        name: faker.person.lastName(),
        id: faker.string.uuid(),
      };
    });

    it('should call authenticationService.login with the correct parameters', async () => {
      const email = faker.internet.email();
      const token = (loginResponse as LoginPayload).jwtToken;
      authenticationService.login.mockReturnValue(of(loginResponse));
      userService.fetch.mockReturnValue(of({} as User));

      await service.execute(email, token);

      expect(authenticationService.login).toHaveBeenCalledWith(email, token);
    });
    it('should throw InvalidCredentialError if login fails', async () => {
      const email = faker.internet.email();
      const token = faker.string.uuid();
      const loginResponse = new InvalidCredentialError();
      const errorMessage = 'Invalid credentials. Please check your email and password.';
      authenticationService.login.mockReturnValue(of(loginResponse));

      await expect(async () => await service.execute(email, token)).rejects.toThrow(errorMessage);
    });
    it('should store the JWT and jwtRefresh tokens in local storage', async () => {
      const setItemSpy = jest.spyOn(localStorage, 'setItem');
      authenticationService.login.mockReturnValue(of(loginResponse));
      userService.fetch.mockReturnValue(of(user));

      await service.execute(user.email, loginResponse.jwtToken);

      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', loginResponse.jwtToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtRefreshToken', loginResponse.jwtRefreshToken);
    });
    it('should fetch the user details using userService', async () => {
      authenticationService.login.mockReturnValue(of(loginResponse));
      userService.fetch.mockReturnValue(of(user));

      await service.execute(user.email, loginResponse.jwtToken);

      expect(userService.fetch).toHaveBeenCalledWith(loginResponse.userId, loginResponse.jwtToken);
    });
    it('should register the user in the user store', async () => {
      authenticationService.login.mockReturnValue(of(loginResponse));
      userService.fetch.mockReturnValue(of(user));

      await service.execute(user.email, loginResponse.jwtToken);

      expect(userStore.load).toHaveBeenCalledWith(user);
    });
    it('should navigate to the dashboard route', async () => {
      authenticationService.login.mockReturnValue(of(loginResponse));
      userService.fetch.mockReturnValue(of(user));

      await service.execute(user.email, loginResponse.jwtToken);

      expect(router.navigate).toHaveBeenCalledWith(['/', APP_ROUTES.APP, APP_ROUTES.DASHBOARD]);
    });
  });
});
