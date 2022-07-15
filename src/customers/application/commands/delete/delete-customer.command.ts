import { ICommand } from '@nestjs/cqrs';

export class DeleteCustomerCommand implements ICommand {
  public readonly id: number;
  constructor(id: number) {
    this.id = id;
  }
}
