import { IQuery } from '@nestjs/cqrs';

export class FindCustomerByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}
