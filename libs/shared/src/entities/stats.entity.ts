import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stats', { schema: 'osu' })
export class Stats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('tinyint', { primary: true, name: 'mode', width: 1 })
  mode: boolean;

  @Column('bigint', { name: 'tscore', unsigned: true, default: 0 })
  tscore: string;

  @Column('bigint', { name: 'rscore', unsigned: true, default: 0 })
  rscore: string;

  @Column('int', { name: 'pp', unsigned: true, default: 0 })
  pp: number;

  @Column('int', { name: 'plays', unsigned: true, default: 0 })
  plays: number;

  @Column('int', { name: 'playtime', unsigned: true, default: 0 })
  playtime: number;

  @Column('float', {
    name: 'acc',
    precision: 6,
    scale: 3,
    default: 0.0,
  })
  acc: number;

  @Column('int', { name: 'max_combo', unsigned: true, default: 0 })
  max_combo: number;

  @Column('int', { name: 'total_hits', unsigned: true, default: 0 })
  total_hits: number;

  @Column('int', { name: 'replay_views', unsigned: true, default: 0 })
  replay_views: number;

  @Column('int', { name: 'xh_count', unsigned: true, default: 0 })
  xh_count: number;

  @Column('int', { name: 'x_count', unsigned: true, default: 0 })
  x_count: number;

  @Column('int', { name: 'sh_count', unsigned: true, default: 0 })
  sh_count: number;

  @Column('int', { name: 's_count', unsigned: true, default: 0 })
  s_count: number;

  @Column('int', { name: 'a_count', unsigned: true, default: 0 })
  a_count: number;
}
