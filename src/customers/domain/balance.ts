import { ValueObject } from 'src/shared/value.object';

export interface UserBalanceProps {
  amount: number;
}

export class Balance
  extends ValueObject<UserBalanceProps>
  implements UserBalanceProps
{
  public amount: number;
  static Empty = new Balance({ amount: 0.0 });

  private constructor(props: UserBalanceProps) {
    super(props);

    this.amount = props.amount;
  }

  public static create(amount: number): Balance {
    if (amount < 1) throw new Error('Can not deposit under 1');

    return new Balance({ amount });
  }
}
