import { Request, Response } from 'express';
import { UserService } from '../service/service';

export class UserController {
  constructor(private userService: UserService) {}

  getMe = async (req: Request, res: Response) => {
    const userId = req.user?.userId!;
    if (!userId) return res.status(200).json(null);

    const user = await this.userService.getMe(userId);

    return res.status(200).json(user?.toJSON());
  };
}
