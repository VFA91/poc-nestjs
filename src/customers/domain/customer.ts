import { Address } from './address';
import { Balance } from './balance';
import { Email } from 'src/shared/email';

export class Customer {
  readonly id: number;

  private _name: string;
  private _email: Email;
  private _address: Address;
  private _balance = Balance.Empty;

  private constructor(
    id: number,
    name: string,
    email: Email,
    address: Address,
    balance: Balance,
  ) {
    this.id = id;
    this.setName(name);
    this.setEmail(email);
    this._address = address;
    this._balance = balance;
  }

  static create(
    id: number,
    name: string,
    email: Email,
    address: Address,
  ): Customer {
    return new Customer(id, name, email, address, Balance.Empty);
  }

  update(name: string, email: Email, address: Address) {
    this.setName(name);
    this.setEmail(email);
    this._address = address;
  }

  deposit(amount: number): void {
    this._balance = Balance.create(this._balance.amount + amount);
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this._name,
      email: this._email.value,
      street: this._address?.street,
      city: this._address?.city,
      state: this._address?.state,
      zip: this._address?.zip,
      country: this._address?.country,
      balance: this._balance.amount,
    };
  }

  static fromPrimitives(data: {
    id: number;
    name: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zip: number;
    country: string;
    balance: number;
  }): Customer {
    return new Customer(
      data.id,
      data.name,
      Email.create(data.email),
      Address.create({
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      }),
      data.balance < 1 ? Balance.Empty : Balance.create(data.balance),
    );
  }

  private setName(name: string) {
    if (name === undefined || name === null || name.length <= 0) {
      throw new Error('Name cannot be empty.');
    }
    this._name = name;
  }

  private setEmail(email: Email) {
    if (!email) {
      throw new Error('Email cannot be empty.');
    }
    this._email = email;
  }
}
