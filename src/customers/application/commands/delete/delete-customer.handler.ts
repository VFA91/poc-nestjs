import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { InjectionToken } from '../../injection.token';

import { DeleteCustomerCommand } from './delete-customer.command';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler
  implements ICommandHandler<DeleteCustomerCommand>
{
  constructor(
    @Inject(InjectionToken.CUSTOMER_REPOSITORY)
    private readonly entityRepository: CustomerRepository,
  ) {}
  async execute(command: DeleteCustomerCommand) {
    const customer = await this.entityRepository.findById(command.id);

    if (!customer) throw new NotFoundException('Customer not found');

    return this.entityRepository.delete(command.id);
  }
}
