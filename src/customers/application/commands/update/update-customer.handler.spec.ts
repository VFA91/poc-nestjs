import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';

import { Address } from 'src/customers/domain/address';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { Email } from 'src/shared/email';
import { InjectionToken } from '../../injection.token';
import { Test } from '@nestjs/testing';
import { UpdateCustomerCommand } from './update-customer.command';
import { UpdateCustomerHandler } from './update-customer.handler';

describe('UpdateCustomerHandler', () => {
  let handler: UpdateCustomerHandler;
  let repository: CustomerRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.CUSTOMER_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [UpdateCustomerHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(UpdateCustomerHandler);
    repository = testModule.get(InjectionToken.CUSTOMER_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when customer not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new UpdateCustomerCommand(
        1,
        'name',
        'test@test.com',
        'street',
        'city',
        'state',
        12345,
        'country',
      );

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute UpdateCustomerCommand', async () => {
      const customer = { update: jest.fn() };

      repository.findById = jest.fn().mockResolvedValue(customer);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const email = Email.create('test@test.com');
      const address = Address.create({
        street: 'street',
        city: 'city',
        state: 'state',
        zip: 12345,
        country: 'country',
      });

      const command = new UpdateCustomerCommand(
        1,
        'name',
        'test@test.com',
        'street',
        'city',
        'state',
        12345,
        'country',
      );

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(customer.update).toBeCalledTimes(1);
      expect(customer.update).toBeCalledWith('name', email, address);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(customer);
    });
  });
});
