import { Column, Entity } from 'typeorm';

@Entity('user_profile_history', { schema: 'osu' })
export class UserProfileHistory {
  @Column({
    type: 'int',
    name: 'user_id',
    width: 10,
    nullable: false,
    primary: true,
  })
  user_id: number;

  @Column({
    type: 'int',
    name: 'mode',
    width: 1,
    nullable: false,
    primary: true,
  })
  mode: number;

  @Column({
    type: 'datetime',
    name: 'captured_at',
    default: () => 'CURRENT_TIMESTAMP',
    primary: true,
  })
  captured_at: Date;

  @Column({ type: 'int', name: 'rank', width: 10, nullable: false })
  rank: number;

  @Column({ type: 'int', name: 'pp', width: 10, nullable: false })
  pp: number;

  @Column({ type: 'int', name: 'country_rank', width: 10, nullable: false })
  country_rank: number;
}
