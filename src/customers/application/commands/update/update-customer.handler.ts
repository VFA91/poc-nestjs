import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { InjectionToken } from '../../injection.token';

import { UpdateCustomerCommand } from './update-customer.command';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler
  implements ICommandHandler<UpdateCustomerCommand>
{
  constructor(
    @Inject(InjectionToken.CUSTOMER_REPOSITORY)
    private readonly entityRepository: CustomerRepository,
  ) {}
  async execute(command: UpdateCustomerCommand) {
    const customer = await this.entityRepository.findById(command.id);

    if (!customer) throw new NotFoundException('Customer not found');

    customer.update(command.name, command.email, command.address);

    return this.entityRepository.save(customer);
  }
}
