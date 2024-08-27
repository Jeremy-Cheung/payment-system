import { IsString, IsOptional, IsPhoneNumber, IsNotEmpty, MaxLength, Matches, IsIn } from 'class-validator';
import { countries } from '../../utils/countries';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name can only contain letters',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name can only contain letters',
  })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s,.-]*$/, {
    message: 'Address line 1 can only contain letters, numbers, spaces, commas, periods, and dashes.',
  })
  addr_line1: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s,.-]*$/, {
    message: 'Address line 2 can only contain letters, numbers, spaces, commas, periods, and dashes.',
  })
  addr_line2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s,.-]*$/, {
    message: 'Address line 3 can only contain letters, numbers, spaces, commas, periods, and dashes.',
  })
  addr_line3?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Postcode can only contain letters and numbers.',
  })
  @MaxLength(10, {
    message: 'Postcode must be 10 characters or less.',
  })
  postcode: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(countries, { message: 'Invalid country' })
  country: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @MaxLength(15)
  phone_number: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  bank_acct_no?: string;
}
