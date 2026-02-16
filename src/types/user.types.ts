import { User, Prisma } from '../../prisma/generated/prisma/client';

export type UserEntity = User;

export type UserTypes = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    role: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type CreateUserInput = Prisma.UserCreateInput;

export type UpdateUserInput = Prisma.UserUpdateInput;

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type AuthResponse = {
  access_token: string;
  user: UserTypes;
};
