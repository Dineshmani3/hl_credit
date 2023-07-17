import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Party, PartyRelations, Bills, Ledger} from '../models';
import {BillsRepository} from './bills.repository';
import {LedgerRepository} from './ledger.repository';

export class PartyRepository extends DefaultCrudRepository<
  Party,
  typeof Party.prototype.id,
  PartyRelations
> {

  public readonly bills: HasManyRepositoryFactory<Bills, typeof Party.prototype.id>;

  public readonly ledgers: HasManyRepositoryFactory<Ledger, typeof Party.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('BillsRepository') protected billsRepositoryGetter: Getter<BillsRepository>, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>,


  ) {
    super(Party, dataSource);
    this.ledgers = this.createHasManyRepositoryFactoryFor('ledgers', ledgerRepositoryGetter,);
    this.registerInclusionResolver('ledgers', this.ledgers.inclusionResolver);
    this.bills = this.createHasManyRepositoryFactoryFor('bills', billsRepositoryGetter,);
    this.registerInclusionResolver('bills', this.bills.inclusionResolver);

  }

}

