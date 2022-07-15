import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCustomerCommand } from './application/commands/create/create-customer.command';
import { DeleteCustomerCommand } from './application/commands/delete/delete-customer.command';
import { UpdateCustomerCommand } from './application/commands/update/update-customer.command';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DepositDto } from './dto/deposit.dto';
import { DepositCommand } from './application/commands/deposit/deposit.command';
import { FindCustomersQuery } from './application/queries/find-customers/find-customers.query';
import { FindCustomerByIdQuery } from './application/queries/find-customer/find-customer-by-id.query';

@Controller('customers')
export class CustomersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<number> {
    return await this.commandBus.execute(
      new CreateCustomerCommand(
        createCustomerDto.name,
        createCustomerDto.email,
        createCustomerDto.street,
        createCustomerDto.city,
        createCustomerDto.state,
        createCustomerDto.zip,
        createCustomerDto.country,
      ),
    );
  }

  @Get()
  async findAll(): Promise<CustomerDto[]> {
    return this.queryBus.execute(new FindCustomersQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CustomerDto[]> {
    return this.queryBus.execute(new FindCustomerByIdQuery(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateCustomerCommand(
        id,
        updateCustomerDto.name,
        updateCustomerDto.email,
        updateCustomerDto.street,
        updateCustomerDto.city,
        updateCustomerDto.state,
        updateCustomerDto.zip,
        updateCustomerDto.country,
      ),
    );
  }

  @Post('/:id/deposit')
  async deposit(
    @Param('id') id: number,
    @Body() deposit: DepositDto,
  ): Promise<void> {
    await this.commandBus.execute(new DepositCommand(id, deposit.amount));
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteCustomerCommand(id));
  }
}
