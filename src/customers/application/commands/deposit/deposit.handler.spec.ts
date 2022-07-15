import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';

import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { DepositCommand } from './deposit.command';
import { DepositHandler } from './deposit.handler';
import { InjectionToken } from '../../injection.token';
import { Test } from '@nestjs/testing';

describe('DepositHandler', () => {
  let handler: DepositHandler;
  let repository: CustomerRepository;

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.CUSTOMER_REPOSITORY,
      useValue: {},
    };
    const providers: Provider[] = [DepositHandler, repoProvider];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    handler = testModule.get(DepositHandler);
    repository = testModule.get(InjectionToken.CUSTOMER_REPOSITORY);
  });

  describe('execute', () => {
    it('should throw NotFoundException when customer not found', async () => {
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new DepositCommand(1, 100);

      await expect(handler.execute(command)).rejects.toThrowError(
        NotFoundException,
      );
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
    });

    it('should execute DepositCommand', async () => {
      const customer = {
        deposit: jest.fn().mockReturnValue(undefined),
      };

      repository.findById = jest.fn().mockResolvedValue(customer);
      repository.save = jest.fn().mockResolvedValue(undefined);

      const command = new DepositCommand(1, 100);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(command.id);
      expect(customer.deposit).toBeCalledTimes(1);
      expect(customer.deposit).toBeCalledWith(command.amount);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(customer);
    });
  });
});
