import { Address } from 'src/customers/domain/address';
import { Email } from 'src/shared/email';
import { ICommand } from '@nestjs/cqrs';

export class UpdateCustomerCommand implements ICommand {
  public readonly id: number;
  public readonly email: Email;
  public readonly address: Address;
  constructor(
    id: number,
    public name: string,
    newEmail: string,
    street: string,
    city: string,
    state: string,
    zip: number,
    country: string,
  ) {
    this.id = id;
    this.email = Email.create(newEmail);
    this.address = Address.create({ street, city, state, zip, country });
  }
}
