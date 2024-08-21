import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  client_id: number; // Primary Key

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  addr_line1: string;

  @Column({ nullable: true })
  addr_line2: string;

  @Column({ nullable: true })
  addr_line3: string;

  @Column()
  postcode: string;

  @Column()
  country: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  bank_acct_no: string;

  @OneToMany(() => Payment, (payment) => payment.client)
  payments: Payment[];
}
