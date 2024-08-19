import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  client_id: number;  // Foreign Key to Client

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  rcpt_first_name: string;

  @IsString()
  @IsNotEmpty()
  rcpt_last_name: string;

  @IsString()
  @IsNotEmpty()
  rcpt_bank_name: string;

  @IsString()
  @IsNotEmpty()
  rcpt_acct_no: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  status?: string;  // Defaults to "Pending" in the entity
}