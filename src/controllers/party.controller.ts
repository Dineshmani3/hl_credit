import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Party} from '../models';
import {PartyRepository} from '../repositories';

export class PartyController {
  constructor(
    @repository(PartyRepository)
    public partyRepository: PartyRepository,
  ) { }

  @post('/parties')
  @response(200, {
    description: 'Party model instance',
    content: {'application/json': {schema: getModelSchemaRef(Party)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {
            title: 'NewParty',
            exclude: ['id'],
          }),
        },
      },
    })
    party: Omit<Party, 'id'>,
  ): Promise<Party> {
    return this.partyRepository.create(party);
  }

  // @post('/parties-bulk')
  // @response(200, {
  //   description: 'Party model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Party)}},
  // })
  // async bulkUpload(@requestBody() data: Party[]): Promise<void> {
  //   Use repository methods to save the data in bulk
  //   await this.partyRepository.createAll(data);
  // }

  @get('/parties/count')
  @response(200, {
    description: 'Party model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Party) where?: Where<Party>,
  ): Promise<Count> {
    return this.partyRepository.count(where);
  }

  @get('/parties')
  @response(200, {
    description: 'Array of Party model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Party, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Party) filter?: Filter<Party>,
  ): Promise<Party[]> {
    return this.partyRepository.find(filter);
  }

  @patch('/parties')
  @response(200, {
    description: 'Party PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {partial: true}),
        },
      },
    })
    party: Party,
    @param.where(Party) where?: Where<Party>,
  ): Promise<Count> {
    return this.partyRepository.updateAll(party, where);
  }

  @get('/parties/{id}')
  @response(200, {
    description: 'Party model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Party, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Party, {exclude: 'where'}) filter?: FilterExcludingWhere<Party>
  ): Promise<Party> {
    return this.partyRepository.findById(id, filter);
  }

  @patch('/parties/{id}')
  @response(204, {
    description: 'Party PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {partial: true}),
        },
      },
    })
    party: Party,
  ): Promise<void> {
    await this.partyRepository.updateById(id, party);
  }

  @put('/parties/{id}')
  @response(204, {
    description: 'Party PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() party: Party,
  ): Promise<void> {
    await this.partyRepository.replaceById(id, party);
  }

  @del('/parties/{id}')
  @response(204, {
    description: 'Party DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.partyRepository.deleteById(id);
  }
}
