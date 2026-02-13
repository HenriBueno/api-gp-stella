import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../enums/user-role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'henrique@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({ example: 'Henrique Silva' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name?: string;

  @ApiPropertyOptional({
    example: 'senha123456',
  })
  @IsOptional()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, {})
  role?: UserRole;
}
