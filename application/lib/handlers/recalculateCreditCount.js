import { knex } from '../../config/db_setup';

const recalculateCreditCount = accountId => () => (
  // Sums the total credits for account_id
  new Promise((resolve, reject) => {
    knex.transaction((trx) => {
      knex('credit_transactions')
        .transacting(trx)
        .where({ account_id: accountId })
        .sum('credits')
        .then(response => (
          knex('accounts')
            .where({ id: accountId })
            .update({ credits: response[0]['sum(`credits`)'] })
        ))
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(() => {
      resolve();
    })
    .catch(() => {
      reject({
        location: 'recalculateCreditCount',
        status: 500,
      });
    });
  })
);

export default recalculateCreditCount;
