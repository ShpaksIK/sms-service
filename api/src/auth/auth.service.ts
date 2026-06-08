import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, Tokens } from './../common/types/tokens.type';
import bcrypt from 'bcryptjs';
import { ChangePasswordDto, LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.databaseService.query(
      'SELECT id FROM "user" WHERE email = $1',
      [dto.email],
    );

    if (existingUser.rows.length > 0) {
      throw new ConflictException(
        'Пользователь с таким логином уже зарегистрирован',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.databaseService.transaction(async (client) => {
      await client.query(
        `INSERT INTO "user" (email, password_hash, first_name)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [dto.email, hashedPassword, dto.firstName],
      );
    });
  }

  async login(dto: LoginDto, userAgent?: string, ip?: string): Promise<Tokens> {
    const result = await this.databaseService.query(
      'SELECT id, email, password_hash FROM "user" WHERE email = $1',
      [dto.email],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const tokens = await this.generateTokens(user.id, user.login);
    await this.saveRefreshToken(user.id, tokens.refresh_token, userAgent, ip);

    return tokens;
  }

  async logout(refreshToken: string) {
    await this.databaseService.query(
      'DELETE FROM "session" WHERE refresh_token = $1',
      [refreshToken],
    );
  }

  async changePassword(dto: ChangePasswordDto, userId: string) {
    const result = await this.databaseService.query(
      'SELECT password_hash FROM "user" WHERE id = $1',
      [userId],
    );
    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.databaseService.query(
      'UPDATE "user" SET updated_at = CURRENT_TIMESTAMP, password_hash = $1 WHERE id = $2',
      [hashedPassword, userId],
    );
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    try {
      const sessionResult = await this.databaseService.query(
        `SELECT s.*, u.email
                FROM "session" s
                JOIN "user" u ON s.id_user = u.id
                WHERE s.refresh_token = $1 AND s.expires_at > NOW()`,
        [refreshToken],
      );

      if (sessionResult.rows.length === 0) {
        throw new ForbiddenException('Неверный токен');
      }

      const session = sessionResult.rows[0];

      await this.databaseService.query(
        'DELETE FROM "session" WHERE refresh_token = $1',
        [refreshToken],
      );

      const tokens = await this.generateTokens(session.id_user, session.email);

      await this.saveRefreshToken(
        session.id_user,
        tokens.refresh_token,
        session.user_agent,
        session.ip_address,
      );

      return tokens;
    } catch (error) {
      throw new ForbiddenException('Неверный токен');
    }
  }

  private async generateTokens(userId: number, email: string): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId, email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
        expiresIn: '10m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async saveRefreshToken(
    userId: number,
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.databaseService.query(
      `INSERT INTO "session" (id_user, refresh_token, user_agent, ip_address, expires_at)
            VALUES ($1, $2, $3, $4, $5)`,
      [userId, refreshToken, userAgent, ip, expiresAt],
    );
  }

  async validateUser(userId: number) {
    const result = await this.databaseService.query(
      'SELECT id, email FROM "user" WHERE id = $1',
      [userId],
    );
    return result.rows[0] || null;
  }
}
