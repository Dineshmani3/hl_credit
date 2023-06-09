import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Party, PartyRelations} from '../models';

export class PartyRepository extends DefaultCrudRepository<
  Party,
  typeof Party.prototype.id,
  PartyRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Party, dataSource);
  }
}
