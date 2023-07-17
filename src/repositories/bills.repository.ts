import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Bills, BillsRelations, Ledger} from '../models';
import {LedgerRepository} from './ledger.repository';

export class BillsRepository extends DefaultCrudRepository<
  Bills,
  typeof Bills.prototype.id,
  BillsRelations
> {

  public readonly ledgers: HasManyRepositoryFactory<Ledger, typeof Bills.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>,
  ) {
    super(Bills, dataSource);
    this.ledgers = this.createHasManyRepositoryFactoryFor('ledgers', ledgerRepositoryGetter,);
    this.registerInclusionResolver('ledgers', this.ledgers.inclusionResolver);
  }
}
