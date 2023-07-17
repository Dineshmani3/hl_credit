import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Bills,
  Ledger,
} from '../models';
import {BillsRepository} from '../repositories';

export class BillsLedgerController {
  constructor(
    @repository(BillsRepository) protected billsRepository: BillsRepository,
  ) { }

  @get('/bills/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Array of Bills has many Ledger',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ledger)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Ledger>,
  ): Promise<Ledger[]> {
    return this.billsRepository.ledgers(id).find(filter);
  }

  @post('/bills/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Bills model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ledger)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Bills.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {
            title: 'NewLedgerInBills',
            exclude: ['id'],
            optional: ['billsId']
          }),
        },
      },
    }) ledger: Omit<Ledger, 'id'>,
  ): Promise<Ledger> {
    return this.billsRepository.ledgers(id).create(ledger);
  }

  @patch('/bills/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Bills.Ledger PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Partial<Ledger>,
    @param.query.object('where', getWhereSchemaFor(Ledger)) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.billsRepository.ledgers(id).patch(ledger, where);
  }

  @del('/bills/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Bills.Ledger DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Ledger)) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.billsRepository.ledgers(id).delete(where);
  }
}
