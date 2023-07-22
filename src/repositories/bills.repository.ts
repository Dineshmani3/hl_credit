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

  definePersistedModel(entityClass: typeof Bills) {
    const modelClass = super.definePersistedModel(entityClass);
    // modelClass.observe('before save', async ctx => {
    //   console.log(`going to save ${ctx.Model.modelName}`);
    // });

    modelClass.observe('before save', async function updateOutstanding(ctx) {
      if (ctx.instance) {
        // const partyModel = await modelClass.repository.parties();
        // const party = await partyModel.findById(ctx.instance.partyId);

        const partyModel = await ctx.repositoryGetter().parties();
        const party = await partyModel.findById(ctx.instance.partyId);
        // const partyRepository = ctx.target.constructor.relations.party.repository;
        // const party = await partyRepository.findById(ctx.instance.partyId);
        if (party) {
          party.outstanding = (party.outstanding || 0) + ctx.instance.amount;
          await partyModel.update(party);
        }
      }
    })
    return modelClass;
  }

}

