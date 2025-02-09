import { Request, Response } from 'express';
import { AuthService } from './service';

export class AuthController {
  private COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' as const,
    path: '/',
  };
  constructor(private authService: AuthService) {}

  private setAccessToken = (res: Response, token: string) => {
    res.cookie('accessToken', token, { ...this.COOKIE_OPTIONS, maxAge: 2 * 60 * 60 * 1000 });
  };

  private setRefreshToken = (res: Response, token: string) => {
    res.cookie('refreshToken', token, { ...this.COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 });
  };

  signUp = async (req: Request, res: Response) => {
    const signUpDto = req.body;
    const { accessToken, refreshToken, user } = await this.authService.signUp(signUpDto);
    this.setAccessToken(res, accessToken);
    this.setRefreshToken(res, refreshToken);

    return res.status(201).json({ user: user.toJSON() });
  };

  signIn = async (req: Request, res: Response) => {
    const signInDto = req.body;
    const { user, accessToken, refreshToken } = await this.authService.signIn(signInDto);
    this.setAccessToken(res, accessToken);
    this.setRefreshToken(res, refreshToken);

    return res.status(201).json({ user: user.toJSON() });
  };

  refreshUserToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const accessToken = await this.authService.refreshUserToken(refreshToken);
    this.setAccessToken(res, accessToken);

    return res.status(201).json({ message: 'refresh success' });
  };
}
