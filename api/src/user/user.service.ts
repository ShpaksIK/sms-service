import {
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { camelToSnakeFields } from 'src/utils/rename-fields';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async getMe(userId: string) {
    const data = await this.databaseService.query(
      `SELECT id, email, first_name as "firstName", 
      created_at as "createdAt", updated_at as "updatedAt"
      FROM "user" WHERE id = $1`,
      [userId],
    );

    if (!data.rows[0]) {
      throw new NotFoundException('Пользователь не найден');
    }

    return data.rows[0];
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const updateRows = camelToSnakeFields(Object.keys(updateUserDto))
      .map((row, i) => `${row} = $${i + 2}`)
      .join(', ');
    const updateValues = Object.values(updateUserDto);

    const updatedUser = await this.databaseService.query(
      `UPDATE "user" SET ${updateRows},
                updated_at = CURRENT_TIMESTAMP
                WHERE id = $1 RETURNING id`,
      [userId, ...updateValues],
    );

    if (!updatedUser.rows[0]) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async remove(userId: string) {
    const comment = await this.databaseService.query(
      `DELETE FROM "user" WHERE id = $1 RETURNING id`,
      [userId],
    );

    if (!comment.rows[0]) {
      throw new NotFoundException('Пользователь не найден');
    }
  }
}
