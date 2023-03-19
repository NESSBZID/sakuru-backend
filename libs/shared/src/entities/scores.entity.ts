import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('scores', { schema: 'osu' })
export class Scores {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: string;

  @Column('char', { name: 'map_md5', length: 32 })
  map_md5: string;

  @Column('int', { name: 'score' })
  score: number;

  @Column('float', { name: 'pp', precision: 7, scale: 3 })
  pp: number;

  @Column('float', { name: 'acc', precision: 6, scale: 3 })
  acc: number;

  @Column('int', { name: 'max_combo' })
  max_combo: number;

  @Column('int', { name: 'mods' })
  mods: number;

  @Column('int', { name: 'n300' })
  n300: number;

  @Column('int', { name: 'n100' })
  n100: number;

  @Column('int', { name: 'n50' })
  n50: number;

  @Column('int', { name: 'nmiss' })
  nmiss: number;

  @Column('int', { name: 'ngeki' })
  ngeki: number;

  @Column('int', { name: 'nkatu' })
  nkatu: number;

  @Column('varchar', { name: 'grade', length: 2, default: 'N' })
  grade: string;

  @Column('tinyint', { name: 'status' })
  status: number;

  @Column('tinyint', { name: 'mode' })
  mode: number;

  @Column('datetime', { name: 'play_time' })
  play_time: Date;

  @Column('int', { name: 'time_elapsed' })
  time_elapsed: number;

  @Column('int', { name: 'client_flags' })
  client_flags: number;

  @Column('int', { name: 'userid' })
  userid: number;

  @Column('tinyint', { name: 'perfect', width: 1 })
  perfect: boolean;

  @Column('char', { name: 'online_checksum', length: 32 })
  online_checksum: string;
}
