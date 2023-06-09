import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserTable, UserTableRelations, UserInfoTable, Party} from '../models';
import {UserInfoTableRepository} from './user-info-table.repository';
import {PartyRepository} from './party.repository';

export class UserTableRepository extends DefaultCrudRepository<
  UserTable,
  typeof UserTable.prototype.id,
  UserTableRelations
> {

  public readonly userInfoTable: HasOneRepositoryFactory<UserInfoTable, typeof UserTable.prototype.id>;

  public readonly parties: HasManyRepositoryFactory<Party, typeof UserTable.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('UserInfoTableRepository') protected userInfoTableRepositoryGetter: Getter<UserInfoTableRepository>, @repository.getter('PartyRepository') protected partyRepositoryGetter: Getter<PartyRepository>,
  ) {
    super(UserTable, dataSource);
    this.parties = this.createHasManyRepositoryFactoryFor('parties', partyRepositoryGetter,);
    this.registerInclusionResolver('parties', this.parties.inclusionResolver);
    this.userInfoTable = this.createHasOneRepositoryFactoryFor('userInfoTable', userInfoTableRepositoryGetter);
    this.registerInclusionResolver('userInfoTable', this.userInfoTable.inclusionResolver);
  }
}
