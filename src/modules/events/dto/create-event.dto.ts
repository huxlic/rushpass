import { IsDate, IsString, Length, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  description?: string;

  @IsString()
  @Length(3, 100)
  venueName: string;

  @IsString()
  @Length(3, 100)
  venueAddress: string;

  @IsString()
  @Length(3, 100)
  venueCity: string;

  @IsDate()
  startTime: string;
}
