import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Beat} from '../models';
import {BeatRepository} from '../repositories';

export class BeatController {
  constructor(
    @repository(BeatRepository)
    public beatRepository : BeatRepository,
  ) {}

  @post('/beats')
  @response(200, {
    description: 'Beat model instance',
    content: {'application/json': {schema: getModelSchemaRef(Beat)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beat, {
            title: 'NewBeat',
            exclude: ['id'],
          }),
        },
      },
    })
    beat: Omit<Beat, 'id'>,
  ): Promise<Beat> {
    return this.beatRepository.create(beat);
  }

  @get('/beats/count')
  @response(200, {
    description: 'Beat model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Beat) where?: Where<Beat>,
  ): Promise<Count> {
    return this.beatRepository.count(where);
  }

  @get('/beats')
  @response(200, {
    description: 'Array of Beat model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Beat, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Beat) filter?: Filter<Beat>,
  ): Promise<Beat[]> {
    return this.beatRepository.find(filter);
  }

  @patch('/beats')
  @response(200, {
    description: 'Beat PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beat, {partial: true}),
        },
      },
    })
    beat: Beat,
    @param.where(Beat) where?: Where<Beat>,
  ): Promise<Count> {
    return this.beatRepository.updateAll(beat, where);
  }

  @get('/beats/{id}')
  @response(200, {
    description: 'Beat model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Beat, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Beat, {exclude: 'where'}) filter?: FilterExcludingWhere<Beat>
  ): Promise<Beat> {
    return this.beatRepository.findById(id, filter);
  }

  @patch('/beats/{id}')
  @response(204, {
    description: 'Beat PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Beat, {partial: true}),
        },
      },
    })
    beat: Beat,
  ): Promise<void> {
    await this.beatRepository.updateById(id, beat);
  }

  @put('/beats/{id}')
  @response(204, {
    description: 'Beat PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() beat: Beat,
  ): Promise<void> {
    await this.beatRepository.replaceById(id, beat);
  }

  @del('/beats/{id}')
  @response(204, {
    description: 'Beat DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.beatRepository.deleteById(id);
  }
}
