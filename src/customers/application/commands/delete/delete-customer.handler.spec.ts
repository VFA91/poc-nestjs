import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';

import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { DeleteCustomerCommand } from './delete-customer.command';
import { DeleteCustomerHandler } from './delete-customer.handler';
import { InjectionToken } from '../../injection.token';
import { Test } from '@nestjs/testing';

describe('DeleteCustomerHandler', () => {
  let handler: DeleteCustomerHandler;
  let repository: CustomerRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.CUSTOMER_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [DeleteCustomerHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(DeleteCustomerHandler);
    repository = testModule.get(InjectionToken.CUSTOMER_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when customer not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new DeleteCustomerCommand(1);

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute DeleteCustomerCommand', async () => {
      const customer = { id: 1 };

      repository.findById = jest.fn().mockResolvedValue(customer);
      repository.delete = jest.fn().mockResolvedValue(undefined);

      const command = new DeleteCustomerCommand(1);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(repository.delete).toBeCalledTimes(1);
      expect(repository.delete).toBeCalledWith(1);
    });
  });
});
