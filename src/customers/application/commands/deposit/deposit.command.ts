import { ICommand } from '@nestjs/cqrs';

export class DepositCommand implements ICommand {
  constructor(public id: number, public amount: number) {
    this.id = id;
    this.amount = amount;
  }
}
