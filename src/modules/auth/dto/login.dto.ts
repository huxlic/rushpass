import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'enter a valid email address' })
  @Length(5, 100)
  email: string;

  @IsString()
  @Length(5, 20)
  password: string;
}
