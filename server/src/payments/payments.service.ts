import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Client } from '../clients/entities/client.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  // Correct service name
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const client = await this.clientRepository.findOne({
      where: { client_id: createPaymentDto.client_id },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${createPaymentDto.client_id} not found`,
      );
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      client,
    });

    return await this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({ relations: ['client'] });
  }

  async findOne(payment_id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { payment_id },
      relations: ['client'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${payment_id} not found`);
    }
    return payment;
  }

  async update(
    payment_id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.preload({
      payment_id,
      ...updatePaymentDto,
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${payment_id} not found`);
    }

    return await this.paymentRepository.save(payment);
  }

  async remove(payment_id: number): Promise<void> {
    const result = await this.paymentRepository.delete(payment_id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${payment_id} not found`);
    }
  }
}
