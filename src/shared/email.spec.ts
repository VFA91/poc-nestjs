import { Email } from './email';

describe('Email', () => {
  it('should return Email cannot be blank error if email is empty', () => {
    const action = () => Email.create('');

    expect(action).toThrowError('Email cannot be empty.');
  });

  it('should return Email cannot be blank error if email is null', () => {
    const action = () => Email.create(null);

    expect(action).toThrowError('Email cannot be empty.');
  });

  it('should return Email cannot be blank error if email is undefined', () => {
    const action = () => Email.create(undefined);

    expect(action).toThrowError('Email cannot be empty.');
  });

  it.each([
    ['teSt@teSt.com', 'test@test.com'],
    ['1234567890@test.com', '1234567890@test.com'],
    ['あいうえお@example.com', 'あいうえお@example.com'],
    ['Abc.123@test.es', 'abc.123@test.es'],
  ])('should return success reponse if email is valid', (input, expected) => {
    const result = Email.create(input);

    expect(result.value).toEqual(expected);
  });

  it.each([['test.com'], ['email @test..com'], ['email@test'], ['test']])(
    'should return Invalid email error if email is invalid',
    (input) => {
      const action = () => Email.create(input);

      expect(action).toThrowError('Email is invalid.');
    },
  );
});
