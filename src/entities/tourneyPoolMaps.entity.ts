import { Column, Entity, Index } from 'typeorm';

@Index('tourney_pool_maps_tourney_pools_id_fk', ['pool_id'], {})
@Entity('tourney_pool_maps', { schema: 'osu' })
export class TourneyPoolMaps {
  @Column('int', { primary: true, name: 'map_id' })
  map_id: number;

  @Column('int', { primary: true, name: 'pool_id' })
  pool_id: number;

  @Column('int', { name: 'mods' })
  mods: number;

  @Column('tinyint', { name: 'slot' })
  slot: number;
}
