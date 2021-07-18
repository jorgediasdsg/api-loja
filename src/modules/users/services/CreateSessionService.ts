import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect Email/Password.', 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect Email/Password.', 401);
    }

    const token = sign({}, '521821dcb7aa85b70f6760058db6eda1881fca55', {
      subject: user.id,
      expiresIn: '1h',
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionService;
