import { Column, Entity, Index } from 'typeorm';

@Index('maps_id_uindex', ['id'], { unique: true })
@Index('maps_md5_uindex', ['md5'], { unique: true })
@Entity('maps', { schema: 'osu' })
export class Maps {
  @Column('enum', {
    primary: true,
    name: 'server',
    enum: ['osu!', 'private'],
    default: () => "'osu!'",
  })
  server: 'osu!' | 'private';

  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { name: 'set_id' })
  set_id: number;

  @Column('int', { name: 'status' })
  status: number;

  @Column('char', { name: 'md5', unique: true, length: 32 })
  md5: string;

  @Column('varchar', { name: 'artist', length: 128 })
  artist: string;

  @Column('varchar', { name: 'title', length: 128 })
  title: string;

  @Column('varchar', { name: 'version', length: 128 })
  version: string;

  @Column('varchar', { name: 'creator', length: 19 })
  creator: string;

  @Column('varchar', { name: 'filename', length: 256 })
  filename: string;

  @Column('datetime', { name: 'last_update' })
  last_update: Date;

  @Column('int', { name: 'total_length' })
  total_length: number;

  @Column('int', { name: 'max_combo' })
  max_combo: number;

  @Column('tinyint', { name: 'frozen', width: 1, default: 0 })
  frozen: boolean;

  @Column('int', { name: 'plays', default: 0 })
  plays: number;

  @Column('int', { name: 'passes', default: 0 })
  passes: number;

  @Column('tinyint', { name: 'mode', width: 1, default: 0 })
  mode: boolean;

  @Column('float', {
    name: 'bpm',
    precision: 12,
    scale: 2,
    default: () => "'0.00'",
  })
  bpm: number;

  @Column('float', {
    name: 'cs',
    precision: 4,
    scale: 2,
    default: () => "'0.00'",
  })
  cs: number;

  @Column('float', {
    name: 'ar',
    precision: 4,
    scale: 2,
    default: () => "'0.00'",
  })
  ar: number;

  @Column('float', {
    name: 'od',
    precision: 4,
    scale: 2,
    default: () => "'0.00'",
  })
  od: number;

  @Column('float', {
    name: 'hp',
    precision: 4,
    scale: 2,
    default: () => "'0.00'",
  })
  hp: number;

  @Column('float', {
    name: 'diff',
    precision: 6,
    scale: 3,
    default: () => "'0.000'",
  })
  diff: number;
}
