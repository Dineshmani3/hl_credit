import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Party, PartyRelations, Bills, Ledger} from '../models';
import {LedgerRepository} from './ledger.repository';
import {BillsRepository} from './bills.repository';

export class PartyRepository extends DefaultCrudRepository<
  Party,
  typeof Party.prototype.id,
  PartyRelations
> {

  public readonly bills: HasManyThroughRepositoryFactory<Bills, typeof Bills.prototype.id,
          Ledger,
          typeof Party.prototype.id
        >;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>, @repository.getter('BillsRepository') protected billsRepositoryGetter: Getter<BillsRepository>,


  ) {
    super(Party, dataSource);
    this.bills = this.createHasManyThroughRepositoryFactoryFor('bills', billsRepositoryGetter, ledgerRepositoryGetter,);
    this.registerInclusionResolver('bills', this.bills.inclusionResolver);


  }

}
