import { Address } from 'src/customers/domain/address';
import { Email } from 'src/shared/email';
import { ICommand } from '@nestjs/cqrs';

export class CreateCustomerCommand implements ICommand {
  public readonly email: Email;
  public readonly address: Address;
  constructor(
    public name: string,
    email: string,
    street: string,
    city: string,
    state: string,
    zip: number,
    country: string,
  ) {
    this.email = Email.create(email);
    this.address = Address.create({ street, city, state, zip, country });
  }
}
