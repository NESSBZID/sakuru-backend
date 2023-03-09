import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('achievements_desc_uindex', ['desc'], { unique: true })
@Index('achievements_file_uindex', ['file'], { unique: true })
@Index('achievements_name_uindex', ['name'], { unique: true })
@Entity('achievements', { schema: 'osu' })
export class Achievements {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'file', unique: true, length: 128 })
  file: string;

  @Column('varchar', { name: 'name', unique: true, length: 128 })
  name: string;

  @Column('varchar', { name: 'desc', unique: true, length: 256 })
  desc: string;

  @Column('varchar', { name: 'cond', length: 64 })
  cond: string;
}
