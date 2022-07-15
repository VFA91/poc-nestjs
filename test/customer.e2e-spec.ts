import { Test, TestingModule } from '@nestjs/testing';

import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { CustomersModule } from 'src/customers/customers.module';
import { INestApplication } from '@nestjs/common';
import { InjectionToken } from 'src/customers/application/injection.token';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3307,
          username: 'root',
          password: 'root',
          database: 'poc-db-test',
          autoLoadEntities: true,
          synchronize: true,
        }),
        CustomersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    customerRepository = moduleFixture.get(InjectionToken.CUSTOMER_REPOSITORY);
  });

  afterEach(async () => {
    await customerRepository.query('DELETE FROM customers');
  });

  it('should create a new customer', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      })
      .expect(201);
  });

  it('should update a customer', async () => {
    const id = await createCustomer(app);

    await request(app.getHttpServer())
      .patch('/customers/' + id)
      .send({
        name: 'John Doe Jr.',
        email: 'johndoe@gmail.com',
      })
      .expect(200);
  });

  it('should delete a customer', async () => {
    const id = await createCustomer(app);

    await request(app.getHttpServer())
      .delete('/customers/' + id)
      .expect(200);
  });

  it('should deposit', async () => {
    const id = await createCustomer(app);

    await request(app.getHttpServer()).post(`/customers/${id}/deposit`).send({
      amount: 100,
    });

    await request(app.getHttpServer()).post(`/customers/${id}/deposit`).send({
      amount: 33.12,
    });

    const response = await request(app.getHttpServer())
      .get('/customers/' + id)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(133.12);
  });

  it('should get one customer', async () => {
    const id = await createCustomer(app);

    const response = await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(+id);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('johndoe@gmail.com');
  });

  it('should get all customers order by balance', async () => {
    const customerId1 = await createCustomer(app);

    await request(app.getHttpServer())
      .post(`/customers/${customerId1}/deposit`)
      .send({
        amount: 100,
      });

    const customerId2 = (
      await request(app.getHttpServer()).post('/customers').send({
        name: 'Anna Doe',
        email: 'annadoe@gmail.com',
      })
    ).text;

    await request(app.getHttpServer())
      .post(`/customers/${customerId2}/deposit`)
      .send({
        amount: 1000,
      });

    const response = await request(app.getHttpServer())
      .get('/customers')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Anna Doe');
    expect(response.body[0].email).toBe('annadoe@gmail.com');
    expect(response.body[0].balance).toBe(1000);
    expect(response.body[1].name).toBe('John Doe');
    expect(response.body[1].email).toBe('johndoe@gmail.com');
    expect(response.body[1].balance).toBe(100);
  });

  async function createCustomer(app: INestApplication): Promise<string> {
    return (
      await request(app.getHttpServer()).post('/customers').send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      })
    ).text;
  }
});
