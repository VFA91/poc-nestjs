import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { InjectionToken } from '../../injection.token';
import { DepositCommand } from './deposit.command';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand> {
  constructor(
    @Inject(InjectionToken.CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: DepositCommand) {
    const customer = await this.customerRepository.findById(command.id);

    if (!customer) throw new NotFoundException('Customer not found');

    customer.deposit(command.amount);

    await this.customerRepository.save(customer);
  }
}
