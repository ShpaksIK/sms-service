import { HttpService } from '@nestjs/axios';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly baseUrl: string;
  private readonly login: string;
  private readonly password: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => DatabaseService))
    private readonly databaseService: DatabaseService,
  ) {
    this.baseUrl =
      this.configService.get('SMSC_USE_HTTPS') === '1'
        ? 'https://smsc.ru/sys/send.php'
        : 'http://smsc.ru/sys/send.php';
    this.login = this.configService.getOrThrow('SMSC_LOGIN');
    this.password = this.configService.getOrThrow('SMSC_PASSWORD');
  }

  async sendSms(
    phoneNumber: string,
    message: string,
    userId: string,
  ): Promise<any> {
    try {
      const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
      const params = new URLSearchParams({
        login: this.login,
        psw: this.password,
        phones: cleanPhone,
        mes: message,
        charset: this.configService.get('SMSC_CHARSET', 'utf-8'),
        fmt: '3',
      });

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}?${params.toString()}`),
      );

      if (response.data.error_code) {
        this.logger.error(
          `Отправка SMS-сообщения не удалась: ${response.data.error}`,
        );
        throw new HttpException(
          `Отправка SMS-сообщения не удалась: ${response.data.error}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      await this.databaseService.saveOutgoingMessage(
        userId,
        cleanPhone,
        message,
        response.data.id,
        'sent',
      );

      this.logger.log(
        `SMS отправлено на ${phoneNumber}, ID: ${response.data.id}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Отправка SMS-сообщения не удалась: ${error.message}`);
      throw new HttpException(
        'Ошибка связи с SMS-шлюзом',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getUserMessages(userId: string) {
    const query = `
      SELECT 
        m.id,
        m.text,
        m.type,
        m.created_at,
        c.contact_number,
        'pending' as status
      FROM message m
      JOIN conversation c ON m.id_conversation = c.id
      WHERE c.id_user = $1
      ORDER BY m.created_at DESC
      LIMIT 100
    `;
    
    const messages = await this.databaseService.query(query, [userId]);
    return messages.rows;
  }
}
