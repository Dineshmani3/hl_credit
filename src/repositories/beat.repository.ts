import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Beat, BeatRelations, Party} from '../models';
import {PartyRepository} from './party.repository';

export class BeatRepository extends DefaultCrudRepository<
  Beat,
  typeof Beat.prototype.id,
  BeatRelations
> {

  public readonly parties: HasManyRepositoryFactory<Party, typeof Beat.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('PartyRepository') protected partyRepositoryGetter: Getter<PartyRepository>,
  ) {
    super(Beat, dataSource);
    this.parties = this.createHasManyRepositoryFactoryFor('parties', partyRepositoryGetter,);
    this.registerInclusionResolver('parties', this.parties.inclusionResolver);
  }
}
