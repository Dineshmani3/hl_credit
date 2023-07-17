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
Bills,
} from '../models';
import {PartyRepository} from '../repositories';

export class PartyBillsController {
  constructor(
    @repository(PartyRepository) protected partyRepository: PartyRepository,
  ) { }

  @get('/parties/{id}/bills', {
    responses: {
      '200': {
        description: 'Array of Party has many Bills through Ledger',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Bills)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Bills>,
  ): Promise<Bills[]> {
    return this.partyRepository.bills(id).find(filter);
  }

  @post('/parties/{id}/bills', {
    responses: {
      '200': {
        description: 'create a Bills model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bills)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Party.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bills, {
            title: 'NewBillsInParty',
            exclude: ['id'],
          }),
        },
      },
    }) bills: Omit<Bills, 'id'>,
  ): Promise<Bills> {
    return this.partyRepository.bills(id).create(bills);
  }

  @patch('/parties/{id}/bills', {
    responses: {
      '200': {
        description: 'Party.Bills PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bills, {partial: true}),
        },
      },
    })
    bills: Partial<Bills>,
    @param.query.object('where', getWhereSchemaFor(Bills)) where?: Where<Bills>,
  ): Promise<Count> {
    return this.partyRepository.bills(id).patch(bills, where);
  }

  @del('/parties/{id}/bills', {
    responses: {
      '200': {
        description: 'Party.Bills DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Bills)) where?: Where<Bills>,
  ): Promise<Count> {
    return this.partyRepository.bills(id).delete(where);
  }
}
