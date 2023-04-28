import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_profile_history', { schema: 'osu' })
export class UserProfileHistory {
  @PrimaryColumn({
    type: 'int',
    name: 'id',
    width: 10,
    nullable: false,
  })
  id: number;

  @Column({
    type: 'int',
    name: 'mode',
    width: 1,
    nullable: false,
  })
  mode: number;

  @Column({
    type: 'datetime',
    name: 'captured_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  captured_at: Date;

  @Column({ type: 'int', name: 'rank', width: 10, nullable: false })
  rank: number;

  @Column({ type: 'int', name: 'pp', width: 10, nullable: false })
  pp: number;

  @Column({ type: 'int', name: 'country_rank', width: 10, nullable: false })
  country_rank: number;
}
