import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, MaxLength, Matches, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  client_id: number; // Foreign Key to Client

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsIn(['USD', 'GBP', 'EUR', 'SGD', 'HKD', 'JPY'])
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name can only contain letters',
  })
  rcpt_first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name can only contain letters',
  })
  rcpt_last_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s,.-]+$/, {
    message: "Bank name can only contain letters, spaces, commas, dots, and dashes",
  })
  rcpt_bank_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^[0-9]+$/, {
    message: 'Account number can only contain digits',
  })
  rcpt_acct_no: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }) => value.replace(/['";]/g, ""))
  notes?: string;

  @IsString()
  @IsIn(['Pending', 'Approved'])
  @IsOptional()
  status?: string; // Defaults to "Pending" in the entity
}
