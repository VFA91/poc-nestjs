import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Customer,
  CustomerQuery,
} from 'src/customers/application/queries/customer.query';
import { CustomerEntity } from '../entity/customer.entity';

@Injectable()
export class CustomerQueryImplement implements CustomerQuery {
  constructor(
    @InjectRepository(CustomerEntity)
    private entityRepository: Repository<CustomerEntity>,
  ) {}

  async findById(id: number): Promise<Customer | undefined> {
    return this.convertCustomerFromEntity(
      await this.entityRepository.findOne({
        where: { id },
      }),
    );
  }

  async findAll(): Promise<Customer[]> {
    return this.convertCustomersFromEntities(
      await this.entityRepository.find({
        order: { balance: 'DESC' },
      }),
    );
  }

  private convertCustomerFromEntity(
    entity?: CustomerEntity | null,
  ): undefined | Customer {
    return entity ? { ...entity } : undefined;
  }

  private convertCustomersFromEntities(entities: CustomerEntity[]): Customer[] {
    return entities.map((entity) => ({
      ...entity,
    }));
  }
}
