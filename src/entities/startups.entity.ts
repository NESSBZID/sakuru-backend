import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('startups', { schema: 'osu' })
export class Startups {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('tinyint', { name: 'ver_major' })
  ver_major: number;

  @Column('tinyint', { name: 'ver_minor' })
  ver_minor: number;

  @Column('tinyint', { name: 'ver_micro' })
  ver_micro: number;

  @Column('datetime', { name: 'datetime' })
  datetime: Date;
}
