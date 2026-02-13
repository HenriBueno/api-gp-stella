import { User, Prisma } from '../../prisma/generated/prisma/client'; 

export type UserEntity = User;

export type UserInterface = Prisma.UserGetPayload<{
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
