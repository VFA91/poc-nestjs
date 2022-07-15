import { ModuleMetadata, Provider } from '@nestjs/common';

import { Address } from 'src/customers/domain/address';
import { CreateCustomerCommand } from './create-customer.command';
import { CreateCustomerHandler } from './create-customer.handler';
import { Customer } from 'src/customers/domain/customer';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { Email } from 'src/shared/email';
import { InjectionToken } from '../../injection.token';
import { Test } from '@nestjs/testing';

describe('OpenCustomerHandler', () => {
  let handler: CreateCustomerHandler;
  let repository: CustomerRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.CUSTOMER_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [CreateCustomerHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(CreateCustomerHandler);
    repository = testModule.get(InjectionToken.CUSTOMER_REPOSITORY);
  });

  describe('execute', () => {
    it('should execute CreateCustomerHandler', async () => {
      const customer = { create: jest.fn() };

      const id = 33;
      Customer.create = jest.fn().mockReturnValue(customer);
      repository.newId = jest.fn().mockResolvedValue(id);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const email = Email.create('test@test.com');
      const address = Address.create({
        street: 'street',
        city: 'city',
        state: 'state',
        zip: 12345,
        country: 'country',
      });

      const command = new CreateCustomerCommand(
        'name',
        'test@test.com',
        'street',
        'city',
        'state',
        12345,
        'country',
      );

      await expect(handler.execute(command)).resolves.toEqual(id);
      expect(repository.newId).toBeCalledTimes(1);
      expect(Customer.create).toBeCalledTimes(1);
      expect(Customer.create).toBeCalledWith(id, 'name', email, address);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(customer);
    });
  });
});
