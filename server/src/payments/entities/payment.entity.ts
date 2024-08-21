import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number; // Primary Key

  @Column()
  amount: number;

  @Column()
  rcpt_first_name: string;

  @Column()
  rcpt_last_name: string;

  @Column()
  rcpt_bank_name: string;

  @Column()
  rcpt_acct_no: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 'Pending' })
  status: string;

  @ManyToOne(() => Client, (client) => client.payments)
  client: Client; // Foreign Key to Client
}
