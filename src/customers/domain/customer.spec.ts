import { Address } from './address';
import { Customer } from './customer';
import { CustomerDto } from '../dto/customer.dto';
import { Email } from 'src/shared/email';

describe('Customer', () => {
  describe('create', () => {
    it('should throw Error when name is null', () => {
      expect(() =>
        Customer.create(1, null, Email.create('test@tes.com'), null),
      ).toThrowError('Name cannot be empty.');
    });

    it('should throw Error when email is null', () => {
      expect(() => Customer.create(1, 'name', null, null)).toThrowError(
        'Email cannot be empty.',
      );
    });

    it('should create customer', () => {
      const customer = Customer.create(
        1,
        'name',
        Email.create('test@tes.com'),
        Address.create({
          street: 'street',
          city: 'city',
          state: 'state',
          zip: 12345,
          country: 'country',
        }),
      );

      expect(customer.id).toEqual(1);
      const primitives = customer.toPrimitives();
      expect(primitives.name).toEqual('name');
      expect(primitives.email).toEqual('test@tes.com');
      expect(primitives.street).toEqual('street');
      expect(primitives.city).toEqual('city');
      expect(primitives.state).toEqual('state');
      expect(primitives.zip).toEqual(12345);
      expect(primitives.country).toEqual('country');
      expect(primitives.balance).toEqual(0);
    });
  });

  describe('update', () => {
    it('should throw Error when name is null', () => {
      const customer = Customer.create(
        1,
        'name',
        Email.create('test@tes.com'),
        null,
      );
      expect(() =>
        customer.update(null, Email.create('test@tes.com'), null),
      ).toThrowError('Name cannot be empty.');
    });

    it('should throw Error when name is null', () => {
      const customer = Customer.create(
        1,
        'name',
        Email.create('test@tes.com'),
        null,
      );
      expect(() => customer.update('name', null, null)).toThrowError(
        'Email cannot be empty.',
      );
    });

    it('should update customer', () => {
      const customer = Customer.create(
        1,
        'name',
        Email.create('test@tes.com'),
        null,
      );

      customer.update(
        'name2',
        Email.create('test2@test.com'),
        Address.create({
          street: 'street',
          city: 'city',
          state: 'state',
          zip: 12345,
          country: 'country',
        }),
      );

      const primitives = customer.toPrimitives();
      expect(primitives.id).toEqual(1);
      expect(primitives.name).toEqual('name2');
      expect(primitives.email).toEqual('test2@test.com');
      expect(primitives.street).toEqual('street');
      expect(primitives.city).toEqual('city');
      expect(primitives.state).toEqual('state');
      expect(primitives.zip).toEqual(12345);
      expect(primitives.country).toEqual('country');
      expect(primitives.balance).toEqual(0);
    });
  });

  describe('deposit', () => {
    it('should create customer', () => {
      const customer = Customer.create(
        1,
        'name',
        Email.create('test@tes.com'),
        null,
      );

      customer.deposit(100);
      customer.deposit(99.55);
      customer.deposit(33.65);
      customer.deposit(998.56);

      const primitives = customer.toPrimitives();
      expect(primitives.balance).toEqual(1231.76);
    });
  });
});
