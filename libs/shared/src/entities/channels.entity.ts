import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('channels_name_uindex', ['name'], { unique: true })
@Entity('channels', { schema: 'osu' })
export class Channels {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 32 })
  name: string;

  @Column('varchar', { name: 'topic', length: 256 })
  topic: string;

  @Column('int', { name: 'read_priv', default: 1 })
  read_priv: number;

  @Column('int', { name: 'write_priv', default: 2 })
  write_priv: number;

  @Column('tinyint', { name: 'auto_join', width: 1, default: 0 })
  auto_join: boolean;
}
