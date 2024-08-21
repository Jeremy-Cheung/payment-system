import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  // Correct service name
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async findOne(client_id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { client_id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${client_id} not found`);
    }
    return client;
  }

  async update(
    client_id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    await this.clientRepository.update(client_id, updateClientDto);
    const updatedClient = await this.clientRepository.findOne({
      where: { client_id },
    });
    if (!updatedClient) {
      throw new NotFoundException(`Client with ID ${client_id} not found`);
    }
    return updatedClient;
  }

  async remove(client_id: number): Promise<void> {
    const result = await this.clientRepository.delete(client_id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${client_id} not found`);
    }
  }
}
