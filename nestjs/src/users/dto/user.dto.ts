import { ApiProperty, PickType } from '@nestjs/swagger';
import { createId } from '@paralleldrive/cuid2';
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// 사용자 정보 DTO
export class UserDto {
  @ApiProperty({
    nullable: false,
    description: '사용자 ID (CUID 자동 생성)',
    example: createId(),
    type: String,
  })
  // 사용자 ID는 CUID로 자동 생성되므로, 사용자가 직접 입력할 필요가 없음
  id: string;

  @ApiProperty({
    nullable: false,
    description: '이메일(최소 5자, 최대 254자, 이메일 형식)',
    example: 'test@test.dev',
    type: String,
  })
  @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  @MinLength(5, { message: '이메일은 최소 5자 이상 입력해야 합니다.' })
  @MaxLength(254, { message: '이메일은 최대 254자까지 입력할 수 있습니다.' })
  // 이메일 제약조건: 최소 5자, 최대 254자, 이메일 형식
  email: string;

  @ApiProperty({
    nullable: false,
    description:
      '비밀번호(해싱 전, 최소 8자, 최대 128자, 영문, 숫자, 특수문자 포함 문자열)',
    example: 'P@ssw0rd!',
    type: String,
  })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(128, { message: '비밀번호는 최대 128자 이하여야 합니다.' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  // 비밀번호 제약조건: 최소 8자, 최대 128자, 영문, 숫자, 특수문자 포함 문자열
  // 이 값은 argon2로 해싱되기 전의 패스워드 값이므로 데이터베이스에 저장 시 반드시 해싱을 해야 함
  password: string;

  @ApiProperty({
    nullable: false,
    description: '닉네임(최소 2자, 최대 50자 문자열)',
    example: '테스터',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  // 닉네임 제약조건: 최소 2자, 최대 50자 문자열
  nickname: string;

  @ApiProperty({
    nullable: true,
    description: 'JWT 리프레시 토큰',
    example: '생략',
    type: String,
  })
  @IsJWT({ message: '올바른 JWT 토큰 형식이어야 합니다.' })
  @Length(1, 1024, {
    message: 'JWT 토큰은 최대 1024자까지 입력할 수 있습니다.',
  })
  refreshToken?: string;

  @ApiProperty({
    nullable: true,
    description: '포인트',
    example: 0,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: '포인트는 0 이상이어야 합니다.' })
  @Max(1000000, { message: '포인트는 최대 1,000,000까지 입력할 수 있습니다.' })
  points?: number;
}

export class CheckEmailRequestDto extends PickType(UserDto, ['email']) {}

export class CheckNicknameRequestDto extends PickType(UserDto, ['nickname']) {}

export class CheckEmailResponseDto {
  @ApiProperty({
    nullable: false,
    description: '이메일 중복 체크 결과 메시지',
    example: '사용 가능한 이메일입니다.',
    type: String,
  })
  message: string;

  @ApiProperty({
    nullable: false,
    description: '상태 코드',
    example: 200,
    type: Number,
  })
  statusCode: number;
}

export class CheckNicknameResponseDto {
  @ApiProperty({
    nullable: false,
    description: '닉네임 중복 체크 결과 메시지',
    example: '사용 가능한 닉네임입니다.',
    type: String,
  })
  message: string;

  @ApiProperty({
    nullable: false,
    description: '상태 코드',
    example: 200,
    type: Number,
  })
  statusCode: number;
}

export class ProfileResponseDto extends PickType(UserDto, [
  'id',
  'email',
  'nickname',
  'points',
]) {}
