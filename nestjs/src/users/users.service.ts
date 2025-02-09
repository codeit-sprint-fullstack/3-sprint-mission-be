import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  userId: number;
  username: string;
  password: string;
}

const users: User[] = [
  {
    userId: 1,
    username: 'Alice',
    password: 'topsecret', // use a hash instead
  },
  {
    userId: 2,
    username: 'Bob',
    password: '123abc', // use a hash instead
  },
];

@Injectable()
export class UsersService {
  async findUserByName(username: string): Promise<User | undefined> {
    return users.find((user) => user.username === username);
  }
}
