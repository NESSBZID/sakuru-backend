import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('map_requests', { schema: 'osu' })
export class MapRequests {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'map_id' })
  map_id: number;

  @Column('int', { name: 'player_id' })
  player_id: number;

  @Column('datetime', { name: 'datetime' })
  datetime: Date;

  @Column('tinyint', { name: 'active', width: 1 })
  active: boolean;
}
