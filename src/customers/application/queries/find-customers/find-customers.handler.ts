import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FindCustomersQuery } from './find-customers.query';
import { Inject } from '@nestjs/common';
import { CustomerDto } from 'src/customers/dto/customer.dto';
import { InjectionToken } from '../../injection.token';
import { CustomerQuery } from '../customer.query';

@QueryHandler(FindCustomersQuery)
export class FindCustomersHandler
  implements IQueryHandler<FindCustomersQuery, CustomerDto[]>
{
  constructor(
    @Inject(InjectionToken.CUSTOMER_QUERY)
    private entityRepository: CustomerQuery,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: FindCustomersQuery): Promise<CustomerDto[]> {
    const customers = await this.entityRepository.findAll();

    return customers.map(
      (customer) =>
        <CustomerDto>{
          id: customer.id,
          name: customer.name,
          email: customer.email,
          street: customer.street,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          country: customer.country,
          balance: customer.balance,
        },
    );
  }
}
