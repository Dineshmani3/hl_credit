import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Bills, BillsRelations} from '../models';

export class BillsRepository extends DefaultCrudRepository<
  Bills,
  typeof Bills.prototype.id,
  BillsRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Bills, dataSource);
  }
}
