import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('clans_name_uindex', ['name'], { unique: true })
@Index('clans_owner_uindex', ['owner'], { unique: true })
@Index('clans_tag_uindex', ['tag'], { unique: true })
@Entity('clans', { schema: 'osu' })
export class Clans {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 16 })
  name: string;

  @Column('varchar', { name: 'tag', unique: true, length: 6 })
  tag: string;

  @Column('varchar', { name: 'description', length: 265 })
  description: string;

  @Column('int', { name: 'owner', unique: true })
  owner: number;

  @Column('datetime', { name: 'created_at' })
  created_at: Date;
}
