import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestOtpDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'enter a valid email address' })
  @Length(5, 100)
  email: string;
}