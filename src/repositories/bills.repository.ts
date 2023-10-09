import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Bills, BillsRelations, Ledger, Party} from '../models';
import {LedgerRepository} from './ledger.repository';
import {PartyRepository} from './party.repository';

export class BillsRepository extends DefaultCrudRepository<
  Bills,
  typeof Bills.prototype.id,
  BillsRelations
> {

  public readonly ledgers: HasManyRepositoryFactory<Ledger, typeof Bills.prototype.id>;

  public readonly party: BelongsToAccessor<Party, typeof Bills.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>, @repository.getter('PartyRepository') protected partyRepositoryGetter: Getter<PartyRepository>,
  ) {
    super(Bills, dataSource);
    this.party = this.createBelongsToAccessorFor('party', partyRepositoryGetter,);
    this.registerInclusionResolver('party', this.party.inclusionResolver);
    this.ledgers = this.createHasManyRepositoryFactoryFor('ledgers', ledgerRepositoryGetter,);
    this.registerInclusionResolver('ledgers', this.ledgers.inclusionResolver);
  }



}

