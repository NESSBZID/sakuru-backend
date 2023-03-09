import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('tourney_pools_users_id_fk', ['created_by'], {})
@Entity('tourney_pools', { schema: 'osu' })
export class TourneyPools {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 16 })
  name: string;

  @Column('datetime', { name: 'created_at' })
  created_at: Date;

  @Column('int', { name: 'created_by' })
  created_by: number;
}
