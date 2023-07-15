import {Entity, model, property} from '@loopback/repository';

@model()
export class Beat extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;


  constructor(data?: Partial<Beat>) {
    super(data);
  }
}

export interface BeatRelations {
  // describe navigational properties here
}

export type BeatWithRelations = Beat & BeatRelations;
