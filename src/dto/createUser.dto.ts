import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/, {
    message:
      'Password must be at least 6 characters long and include 1 number and 1 special character',
  })
  password: string;
}
