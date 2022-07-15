import { Address } from './address';

describe('Address', () => {
  it.each([
    ['street', 'city', 'state', 123, 'country'],
    [null, null, null, null, null],
    [null, 'city', 'state', 123, 'country'],
    ['street', null, 'state', 132, 'country'],
    ['street', 'city', null, 132, 'country'],
    ['street', 'city', 'state', null, 'country'],
    ['street', 'city', 'state', 123, null],
  ])(
    'should return success items valids',
    (street, city, state, zip, country) => {
      const result = Address.create({ street, city, state, zip, country });

      expect(result.street).toEqual(street);
      expect(result.city).toEqual(city);
      expect(result.state).toEqual(state);
      expect(result.zip).toEqual(zip);
      expect(result.country).toEqual(country);
    },
  );
});
