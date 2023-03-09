import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logs', { schema: 'osu' })
export class Logs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'from', comment: 'both from and to are playerids' })
  from: number;

  @Column('int', { name: 'to' })
  to: number;

  @Column('varchar', { name: 'action', length: 32 })
  action: string;

  @Column('varchar', { name: 'msg', nullable: true, length: 2048 })
  msg: string | null;

  @Column('datetime', { name: 'time' })
  time: Date;
}
