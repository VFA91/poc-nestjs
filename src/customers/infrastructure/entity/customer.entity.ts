import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name = '';

  @Column({ type: 'varchar' })
  email = '';

  @Column({ type: 'varchar', nullable: true })
  street = '';

  @Column({ type: 'varchar', nullable: true })
  city = '';

  @Column({ type: 'varchar', nullable: true })
  country = '';

  @Column({ type: 'varchar', nullable: true })
  state = '';

  @Column({ type: 'int', nullable: true })
  zip = 0;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  balance = 0;
}
