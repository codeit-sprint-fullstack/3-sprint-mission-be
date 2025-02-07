import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @IsNotEmpty({ message: '닉네임은 필수입니다.' })
  nickname: string;

  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: '이메일을 입력해주세요.' })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
