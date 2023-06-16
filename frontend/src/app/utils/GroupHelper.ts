import { IGroup } from '../groups/groups.service';

export interface IGroupMemberResult {
  spend: number;
  owes: number;
  payback: number;
}

export interface IGroupResult {
  total: number;
  members: { [user_id: string]: IGroupMemberResult };
}

export const GroupHelper = {
  compute: (group: IGroup) => {
    const result: IGroupResult = {
      total: 0,
      members: {},
    };

    let total = 0;
    group.transactions
      .filter((t) => t.category !== 'PAYBACK')
      .forEach((t) => (total += t.amount));
    result.total = total;

    let members = group.members.filter((m) => !m.pending);
    let length = 0;
    members.forEach((m) => length++);

    members.forEach((m) => {
      const r = (result.members[m.user_id as string] = {
        spend: 0,
        owes: 0,
        payback: 0,
      });
      group.transactions.forEach((t) => {
        if (t.paid_by.user_id === m.user_id) {
          // member self
          if (t.category === 'PAYBACK') {
            r.payback += t.amount;
          } else {
            r.spend += t.amount;
          }
        } else {
          // member others
          if (t.category !== 'PAYBACK') {
            r.owes += t.amount / length;
          }
        }
      });
    });

    const epsilon = 0.000001;
    members.forEach((m) => {
      let r = result.members[m.user_id as string];
      if (r.owes > 0) {
        r.owes = r.owes - r.spend - r.payback;
        if (Math.abs(r.owes) < epsilon) {
          r.owes = 0;
        }
      }

      group.transactions
        .filter((t) => t.category === 'PAYBACK')
        .filter((t) => t.paid_by.user_id !== m.user_id)
        .forEach((t) => {
          let amount = t.amount;
          let delta = amount / length;
          while (amount > epsilon) {
            for (let e in result.members) {
              if (e === t.paid_by.user_id) continue;
              const r2 = result.members[e];
              if (r2.owes <= epsilon) {
                const d = Math.min(Math.abs(r2.owes), delta);
                r2.owes += d;
                amount -= d;
              }
            }
            delta = amount / length;
            delta = Math.max(0.01, delta);

            let remain = 0;
            for (let e in result.members) {
              const r2 = result.members[e];
              if (e !== t.paid_by.user_id) {
                remain += r2.owes;
              }
            }
            if (Math.abs(remain) < epsilon) break;

            // console.log(delta, amount);
          }
        });
    });

    // console.log(result);
    return result;
  },
};
