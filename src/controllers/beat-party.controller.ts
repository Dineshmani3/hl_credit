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
  Beat,
  Party,
} from '../models';
import {BeatRepository} from '../repositories';

export class BeatPartyController {
  constructor(
    @repository(BeatRepository) protected beatRepository: BeatRepository,
  ) { }

  @get('/beats/{id}/parties', {
    responses: {
      '200': {
        description: 'Array of Beat has many Party',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Party)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Party>,
  ): Promise<Party[]> {
    return this.beatRepository.parties(id).find(filter);
  }

  @post('/beats/{id}/parties', {
    responses: {
      '200': {
        description: 'Beat model instance',
        content: {'application/json': {schema: getModelSchemaRef(Party)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Beat.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {
            title: 'NewPartyInBeat',
            exclude: ['id'],
            optional: ['beatId']
          }),
        },
      },
    }) party: Omit<Party, 'id'>,
  ): Promise<Party> {
    return this.beatRepository.parties(id).create(party);
  }

  @patch('/beats/{id}/parties', {
    responses: {
      '200': {
        description: 'Beat.Party PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {partial: true}),
        },
      },
    })
    party: Partial<Party>,
    @param.query.object('where', getWhereSchemaFor(Party)) where?: Where<Party>,
  ): Promise<Count> {
    return this.beatRepository.parties(id).patch(party, where);
  }

  @del('/beats/{id}/parties', {
    responses: {
      '200': {
        description: 'Beat.Party DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Party)) where?: Where<Party>,
  ): Promise<Count> {
    return this.beatRepository.parties(id).delete(where);
  }
}
