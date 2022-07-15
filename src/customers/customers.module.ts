import { Module, Provider } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { CreateCustomerHandler } from './application/commands/create/create-customer.handler';
import { CustomerEntity } from './infrastructure/entity/customer.entity';
import { CustomerQueryImplement } from './infrastructure/query/customer.query';
import { CustomerRepositoryImplement } from './infrastructure/repository/customer.repository';
import { CustomersController } from './customers.controller';
import { DeleteCustomerHandler } from './application/commands/delete/delete-customer.handler';
import { DepositHandler } from './application/commands/deposit/deposit.handler';
import { FindCustomerByIdHandler } from './application/queries/find-customer/find-customer-by-id.handler';
import { FindCustomersHandler } from './application/queries/find-customers/find-customers.handler';
import { InjectionToken } from './application/injection.token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateCustomerHandler } from './application/commands/update/update-customer.handler';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.CUSTOMER_REPOSITORY,
    useClass: CustomerRepositoryImplement,
  },
  {
    provide: InjectionToken.CUSTOMER_QUERY,
    useClass: CustomerQueryImplement,
  },
];

const application = [
  CreateCustomerHandler,
  UpdateCustomerHandler,
  DeleteCustomerHandler,
  DepositHandler,
  FindCustomersHandler,
  FindCustomerByIdHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [...infrastructure, ...application],
})
export class CustomersModule {}
