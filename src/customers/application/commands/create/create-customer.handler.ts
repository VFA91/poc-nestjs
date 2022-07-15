import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateCustomerCommand } from './create-customer.command';
import { Customer } from 'src/customers/domain/customer';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand, number>
{
  constructor(
    @Inject(InjectionToken.CUSTOMER_REPOSITORY)
    private readonly entityRepository: CustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<number> {
    const id = await this.entityRepository.newId();

    const customer = Customer.create(
      id,
      command.name,
      command.email,
      command.address,
    );

    await this.entityRepository.save(customer);

    return id;
  }
}
