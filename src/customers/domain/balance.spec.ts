import { Balance } from './balance';

describe('Balance', () => {
  it('should return Can not deposit under 1 if amount is < 1', () => {
    const action = () => Balance.create(0);

    expect(action).toThrowError('Can not deposit under 1');
  });

  it('should return a amount valid', () => {
    const result = Balance.create(1.23);

    expect(result.amount).toEqual(1.23);
  });
});
