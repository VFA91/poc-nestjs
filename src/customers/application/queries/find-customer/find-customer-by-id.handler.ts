import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindCustomerByIdQuery } from './find-customer-by-id.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { CustomerQuery } from '../customer.query';
import { InjectionToken } from '../../injection.token';
import { CustomerDto } from 'src/customers/dto/customer.dto';

@QueryHandler(FindCustomerByIdQuery)
export class FindCustomerByIdHandler
  implements IQueryHandler<FindCustomerByIdQuery, CustomerDto>
{
  constructor(
    @Inject(InjectionToken.CUSTOMER_QUERY)
    private entityRepository: CustomerQuery,
  ) {}
  async execute(query: FindCustomerByIdQuery): Promise<CustomerDto> {
    const customer = await this.entityRepository.findById(query.id);

    if (!customer) throw new NotFoundException('Customer not found');

    return <CustomerDto>{
      id: customer.id,
      name: customer.name,
      email: customer.email,
      street: customer.street,
      city: customer.city,
      state: customer.state,
      zip: customer.zip,
      country: customer.country,
      balance: customer.balance,
    };
  }
}
