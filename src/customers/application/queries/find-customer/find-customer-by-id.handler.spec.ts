import { Customer, CustomerQuery } from '../customer.query';
import { ModuleMetadata, NotFoundException, Provider } from '@nestjs/common';

import { CustomerDto } from 'src/customers/dto/customer.dto';
import { FindCustomerByIdHandler } from './find-customer-by-id.handler';
import { FindCustomerByIdQuery } from './find-customer-by-id.query';
import { InjectionToken } from '../../injection.token';
import { Test } from '@nestjs/testing';

describe('FindCustomerByIdHandler', () => {
  let customerQuery: CustomerQuery;
  let handler: FindCustomerByIdHandler;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: InjectionToken.CUSTOMER_QUERY,
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindCustomerByIdHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    customerQuery = testModule.get(InjectionToken.CUSTOMER_QUERY);
    handler = testModule.get(FindCustomerByIdHandler);
  });

  describe('execute', () => {
    it('should throw NotFoundException when data is not found', async () => {
      customerQuery.findById = jest.fn().mockResolvedValue(undefined);

      const query = new FindCustomerByIdQuery(5);

      await expect(handler.execute(query)).rejects.toThrowError(
        NotFoundException,
      );
      expect(customerQuery.findById).toBeCalledTimes(1);
      expect(customerQuery.findById).toBeCalledWith(query.id);
    });

    it('should return FindCustomerByIdResult when execute FindCustomerByIdQuery', async () => {
      const customer: Customer = {
        id: 5,
        name: 'name',
        email: 'test@test.com',
        street: 'street',
        city: 'city',
        state: 'state',
        country: 'country',
        zip: 12345,
        balance: 11.12,
      };
      customerQuery.findById = jest.fn().mockResolvedValue(customer);

      const query = new FindCustomerByIdQuery(5);

      const result: CustomerDto = {
        id: 5,
        name: 'name',
        email: 'test@test.com',
        street: 'street',
        city: 'city',
        state: 'state',
        country: 'country',
        zip: 12345,
        balance: 11.12,
      };

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(customerQuery.findById).toBeCalledTimes(1);
      expect(customerQuery.findById).toBeCalledWith(query.id);
    });
  });
});
