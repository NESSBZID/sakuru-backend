import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mail', { schema: 'osu' })
export class Mail {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'from_id' })
  from_id: number;

  @Column('int', { name: 'to_id' })
  to_id: number;

  @Column('varchar', { name: 'msg', length: 2048 })
  msg: string;

  @Column('int', { name: 'time', nullable: true })
  time: number | null;

  @Column('tinyint', { name: 'read', width: 1, default: 0 })
  read: boolean;
}
