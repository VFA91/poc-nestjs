import { Customer } from './customer';

export interface CustomerRepository {
  newId: () => Promise<number>;
  save: (customer: Customer) => Promise<void>;
  findById: (id: number) => Promise<Customer | null>;
  findByIds: (ids: number[]) => Promise<Customer[]>;
  delete: (id: number) => void;
  query: (query: string, parameters?: any[]) => Promise<any>;
}
