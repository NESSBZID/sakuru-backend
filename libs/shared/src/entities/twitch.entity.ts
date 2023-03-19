import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('twitch_osu_id_uindex', ['osu_id'], { unique: true })
@Index('twitch_twitch_id_uindex', ['twitch_id'], { unique: true })
@Entity('twitch', { schema: 'osu' })
export class Twitch {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({
    type: 'int',
    name: 'twitch_id',
    width: 10,
    unique: true,
    nullable: false,
  })
  twitch_id: number;

  @Column({
    type: 'int',
    name: 'osu_id',
    width: 10,
    unique: true,
    nullable: false,
  })
  osu_id: number;

  @Column({ type: 'tinyint', name: 'webhook', width: 1, default: 0 })
  webhook: number;

  @Column({ type: 'tinyint', name: 'webhook', width: 1, default: 0 })
  chatbot: number;
}
