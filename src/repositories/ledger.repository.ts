import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Ledger, LedgerRelations} from '../models';

export class LedgerRepository extends DefaultCrudRepository<
  Ledger,
  typeof Ledger.prototype.id,
  LedgerRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Ledger, dataSource);
  }
}
