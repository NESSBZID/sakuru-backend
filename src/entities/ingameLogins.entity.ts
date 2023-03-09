import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ingame_logins', { schema: 'osu' })
export class IngameLogins {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'userid' })
  userid: number;

  @Column('varchar', { name: 'ip', comment: 'maxlen for ipv6', length: 45 })
  ip: string;

  @Column('date', { name: 'osu_ver' })
  osu_ver: string;

  @Column('varchar', { name: 'osu_stream', length: 11 })
  osu_stream: string;

  @Column('datetime', { name: 'datetime' })
  datetime: Date;
}
