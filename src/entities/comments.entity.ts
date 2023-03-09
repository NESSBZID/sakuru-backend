import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments', { schema: 'osu' })
export class Comments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'target_id', comment: 'replay, map, or set id' })
  target_id: number;

  @Column('enum', { name: 'target_type', enum: ['replay', 'map', 'song'] })
  target_type: 'replay' | 'map' | 'song';

  @Column('int', { name: 'userid' })
  userid: number;

  @Column('int', { name: 'time' })
  time: number;

  @Column('varchar', { name: 'comment', length: 80 })
  comment: string;

  @Column('char', {
    name: 'colour',
    nullable: true,
    comment: 'rgb hex string',
    length: 6,
  })
  colour: string | null;
}
