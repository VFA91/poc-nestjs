import { ValueObject } from './value.object';

export interface UserEmailProps {
  value: string;
}

const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class Email extends ValueObject<UserEmailProps> {
  public readonly value: string;

  private constructor(props: UserEmailProps) {
    super(props);

    this.value = props.value;
  }

  public static create(email: string): Email {
    if (email === undefined || email === null || email.length <= 0) {
      throw new Error('Email cannot be empty.');
    }

    const regExp = new RegExp(EMAIL_PATTERN);

    if (!regExp.test(email)) {
      throw new Error('Email is invalid.');
    }

    return new Email({ value: Email.format(email) });
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }
}
