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
  Party,
  Ledger,
} from '../models';
import {PartyRepository} from '../repositories';

export class PartyLedgerController {
  constructor(
    @repository(PartyRepository) protected partyRepository: PartyRepository,
  ) { }

  @get('/parties/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Array of Party has many Ledger',
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
    return this.partyRepository.ledgers(id).find(filter);
  }

  @post('/parties/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Party model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ledger)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Party.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {
            title: 'NewLedgerInParty',
            exclude: ['id'],
            optional: ['partyId']
          }),
        },
      },
    }) ledger: Omit<Ledger, 'id'>,
  ): Promise<Ledger> {
    return this.partyRepository.ledgers(id).create(ledger);
  }

  @patch('/parties/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Party.Ledger PATCH success count',
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
    return this.partyRepository.ledgers(id).patch(ledger, where);
  }

  @del('/parties/{id}/ledgers', {
    responses: {
      '200': {
        description: 'Party.Ledger DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Ledger)) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.partyRepository.ledgers(id).delete(where);
  }
}
