import { Column, Entity } from 'typeorm';

@Entity('client_hashes', { schema: 'osu' })
export class ClientHashes {
  @Column('int', { primary: true, name: 'userid' })
  userid: number;

  @Column('char', { primary: true, name: 'osupath', length: 32 })
  osupath: string;

  @Column('char', { primary: true, name: 'adapters', length: 32 })
  adapters: string;

  @Column('char', { primary: true, name: 'uninstall_id', length: 32 })
  uninstall_id: string;

  @Column('char', { primary: true, name: 'disk_serial', length: 32 })
  disk_serial: string;

  @Column('datetime', { name: 'latest_time' })
  latest_time: Date;

  @Column('int', { name: 'occurrences', default: 0 })
  occurrences: number;
}
