import { Test, type TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

const mockUser = {
  id: 'user-1',
  email: 'test@afribayit.com',
  passwordHash: bcrypt.hashSync('Password123', 10),
  firstName: 'Test',
  lastName: 'User',
  role: 'BUYER',
  country: 'BJ',
  isActive: true,
  isBanned: false,
  twoFactorEnabled: false,
  twoFactorSecret: null,
  kycLevel: 'NONE',
  reputationScore: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'PRISMA', useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'new@afribayit.com',
        password: 'Password123',
        firstName: 'New',
        lastName: 'User',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@afribayit.com');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(
        service.register({
          email: 'test@afribayit.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'User',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@afribayit.com',
        password: 'Password123',
      });

      expect(result.accessToken).toBeTruthy();
      expect(result.user.email).toBe('test@afribayit.com');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(
        service.login({ email: 'test@afribayit.com', password: 'WrongPassword1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nobody@afribayit.com', password: 'Password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for banned user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, isBanned: true });
      await expect(
        service.login({ email: 'test@afribayit.com', password: 'Password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
