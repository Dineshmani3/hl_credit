import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserInfoTable, UserInfoTableRelations} from '../models';

export class UserInfoTableRepository extends DefaultCrudRepository<
  UserInfoTable,
  typeof UserInfoTable.prototype.id,
  UserInfoTableRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(UserInfoTable, dataSource);
  }
}
