import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  addr_line1: string;

  @IsString()
  @IsOptional()
  addr_line2?: string;

  @IsString()
  @IsOptional()
  addr_line3?: string;

  @IsString()
  @IsNotEmpty()
  postcode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsOptional()
  bank_acct_no?: string;
}
