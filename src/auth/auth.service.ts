import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  AuthResponse,
  UserEntity,
  UserTypes,
  JwtPayload,
} from '../types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { email, password, name, role } = createUserDto;

    if (!password) throw new BadRequestException('Senha é obrigatória');

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new ConflictException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: UserEntity = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role ?? 'USER',
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userSafe } = user;

    return { access_token, user: userSafe as UserTypes };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    if (!email || !password)
      throw new BadRequestException('Email e senha obrigatórios');

    const user: UserEntity | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userSafe } = user;

    return { access_token, user: userSafe as UserTypes };
  }

  async validateUser(payload: JwtPayload): Promise<UserTypes | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;

    const { password, ...result } = user;
    return result as UserTypes;
  }
}
