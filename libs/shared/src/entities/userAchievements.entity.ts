import { Column, Entity } from 'typeorm';

@Entity('user_achievements', { schema: 'osu' })
export class UserAchievements {
  @Column('int', { primary: true, name: 'userid' })
  userid: number;

  @Column('int', { primary: true, name: 'achid' })
  achid: number;
}
