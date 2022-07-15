import { ModuleMetadata, Provider } from '@nestjs/common';

import { CustomerDto } from 'src/customers/dto/customer.dto';
import { CustomerQuery } from '../customer.query';
import { FindCustomersHandler } from './find-customers.handler';
import { FindCustomersQuery } from './find-customers.query';
import { InjectionToken } from '../../injection.token';
import { Test } from '@nestjs/testing';

describe('FindCustomersHandler', () => {
  let handler: FindCustomersHandler;
  let customerQuery: CustomerQuery;

  beforeEach(async () => {
    const queryProvider: Provider = {
      provide: InjectionToken.CUSTOMER_QUERY,
      useValue: {},
    };
    const providers: Provider[] = [queryProvider, FindCustomersHandler];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();
    handler = testModule.get(FindCustomersHandler);
    customerQuery = testModule.get(InjectionToken.CUSTOMER_QUERY);
  });

  describe('execute', () => {
    it('should return FindCustomersResult when execute FindCustomersQuery', async () => {
      const customers: CustomerDto[] = [
        {
          id: 5,
          name: 'name',
          email: 'test@test.com',
          street: 'street',
          city: 'city',
          state: 'state',
          country: 'country',
          zip: 12345,
          balance: 0,
        },
        {
          id: 894,
          name: 'name 2',
          email: 'test2@test.com',
          street: '',
          city: '',
          state: '',
          country: '',
          zip: 12345,
          balance: 654.545,
        },
      ];
      customerQuery.findAll = jest.fn().mockResolvedValue(customers);

      const query = new FindCustomersQuery();

      const result: CustomerDto[] = [
        {
          id: 5,
          name: 'name',
          email: 'test@test.com',
          street: 'street',
          city: 'city',
          state: 'state',
          country: 'country',
          zip: 12345,
          balance: 0,
        },
        {
          id: 894,
          name: 'name 2',
          email: 'test2@test.com',
          street: '',
          city: '',
          state: '',
          country: '',
          zip: 12345,
          balance: 654.545,
        },
      ];

      await expect(handler.execute(query)).resolves.toEqual(result);
      expect(customerQuery.findAll).toBeCalledTimes(1);
      expect(customerQuery.findAll).toBeCalledWith();
    });
  });
});
