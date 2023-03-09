import { Column, Entity, Index } from 'typeorm';

@Index('nmapsets_id_uindex', ['id'], { unique: true })
@Entity('mapsets', { schema: 'osu' })
export class Mapsets {
  @Column('enum', {
    primary: true,
    name: 'server',
    enum: ['osu!', 'private'],
    default: () => "'osu!'",
  })
  server: 'osu!' | 'private';

  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('datetime', {
    name: 'last_osuapi_check',
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_osuapi_check: Date;
}
