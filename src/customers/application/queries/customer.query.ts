export class Customer {
  id: number;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: number;
  balance: number;
}

export interface CustomerQuery {
  findById: (id: number) => Promise<Customer | undefined>;
  findAll: () => Promise<Customer[]>;
}
