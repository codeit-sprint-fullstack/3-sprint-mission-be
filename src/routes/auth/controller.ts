import { Request, Response } from 'express';
import { AuthService } from './service';

export class AuthController {
  constructor(private authService: AuthService) {}

  signUp = async (req: Request, res: Response) => {
    const signUpDto = req.body;
    const userEntity = await this.authService.signUp(signUpDto);
    const user = userEntity.user.toJSON();

    return res.status(201).json({
      ...userEntity,
      user,
    });
  };

  signIn = async (req: Request, res: Response) => {
    const signInDto = req.body;
    const userEntity = await this.authService.signIn(signInDto);
    const user = userEntity.user.toJSON();

    return res.status(201).json({
      ...userEntity,
      user,
    });
  };

  refreshUserToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = this.authService.refreshUserToken(refreshToken);

    return res.status(201).json(tokens);
  };
}
