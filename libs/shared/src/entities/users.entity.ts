import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('users_api_key_uindex', ['api_key'], { unique: true })
@Index('users_email_uindex', ['email'], { unique: true })
@Index('users_name_uindex', ['name'], { unique: true })
@Index('users_safe_name_uindex', ['safe_name'], { unique: true })
@Entity('users', { schema: 'osu' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 32 })
  name: string;

  @Column('varchar', { name: 'safe_name', unique: true, length: 32 })
  safe_name: string;

  @Exclude()
  @Column('varchar', { name: 'email', unique: true, length: 254 })
  email: string;

  @Column('int', { name: 'priv', default: 1 })
  priv: number;

  @Exclude()
  @Column('char', { name: 'pw_bcrypt', length: 60 })
  pw_bcrypt: string;

  @Column('char', { name: 'country', length: 2, default: 'xx' })
  country: string;

  @Column('int', { name: 'silence_end', default: 0 })
  silence_end: number;

  @Column('int', { name: 'donor_end', default: 0 })
  donor_end: number;

  @Column('int', { name: 'creation_time', default: 0 })
  creation_time: number;

  @Column('int', { name: 'latest_activity', default: 0 })
  latest_activity: number;

  @Column('int', { name: 'clan_id', default: 0 })
  clan_id: number;

  @Column('tinyint', { name: 'clan_priv', width: 1, default: 0 })
  clan_priv: boolean;

  @Column('int', { name: 'preferred_mode', default: 0 })
  preferred_mode: number;

  @Column('int', { name: 'play_style', default: 0 })
  play_style: number;

  @Column('varchar', { name: 'custom_badge_name', nullable: true, length: 16 })
  custom_badge_name: string | null;

  @Column('varchar', { name: 'custom_badge_icon', nullable: true, length: 64 })
  custom_badge_icon: string | null;

  @Column('varchar', { name: 'userpage_content', nullable: true, length: 2048 })
  userpage_content: string | null;

  @Exclude()
  @Column('char', { name: 'api_key', nullable: true, unique: true, length: 36 })
  api_key: string | null;

  @Exclude()
  @Column('tinyint', {
    name: 'ban_hwid',
    nullable: true,
    width: 1,
    default: 0,
  })
  ban_hwid: boolean | null;
}
