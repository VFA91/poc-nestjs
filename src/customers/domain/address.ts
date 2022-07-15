import { ValueObject } from 'src/shared/value.object';

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
}

export class Address extends ValueObject<AddressData> implements AddressData {
  public readonly street: string;
  public readonly city: string;
  public readonly state: string;
  public readonly zip: number;
  public readonly country: string;

  private constructor(data: AddressData) {
    super(data);

    this.street = data.street;
    this.city = data.city;
    this.state = data.state;
    this.zip = data.zip;
    this.country = data.country;
  }

  public static create(data: AddressData): Address {
    return new Address(data);
  }
}
