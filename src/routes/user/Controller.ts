import { Request, Response } from 'express';
import { UserService } from './service';

export class UserController {
  constructor(private userService: UserService) {}

  getMe = async (req: Request, res: Response) => {
    const userId = req.user?.userId!;
    const user = await this.userService.getMe(userId);

    return res.status(200).json(user.toJSON());
  };
}
