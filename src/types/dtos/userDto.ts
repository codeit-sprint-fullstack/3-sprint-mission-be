export interface userInfo {
  image: string | null;
  id: number;
  nickname: string;
}

export interface CreateUserRequestDto {
  email: string;
  nickname: string;
  encryptedPassword: string;
}
