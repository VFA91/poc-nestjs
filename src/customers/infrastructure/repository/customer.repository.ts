import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { CustomerEntity } from '../entity/customer.entity';
import { Customer } from 'src/customers/domain/customer';

export class CustomerRepositoryImplement implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private entityRepository: Repository<CustomerEntity>,
  ) {}

  async newId(): Promise<number> {
    const emptyEntity = new CustomerEntity();
    const entity = await this.entityRepository.save(emptyEntity);
    return entity.id;
  }

  async save(customer: Customer): Promise<void> {
    const model = customer.toPrimitives();
    await this.entityRepository.save(model);
  }

  delete(id: number): void {
    this.entityRepository.delete(id);
  }

  async findById(id: number): Promise<Customer | null> {
    const entity = await this.entityRepository.findOneBy({ id: +id });
    return entity ? Customer.fromPrimitives(entity) : null;
  }

  async findByIds(ids: number[]): Promise<Customer[]> {
    const entities = await this.entityRepository.findBy({ id: In(ids) });
    return entities.map((entity) => Customer.fromPrimitives(entity));
  }

  async query(query: string, parameters?: any[]): Promise<any> {
    return this.entityRepository.query(query, parameters);
  }
}
