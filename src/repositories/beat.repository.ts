import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Beat, BeatRelations} from '../models';

export class BeatRepository extends DefaultCrudRepository<
  Beat,
  typeof Beat.prototype.id,
  BeatRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Beat, dataSource);
  }
}
