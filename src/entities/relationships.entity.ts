import { Column, Entity } from 'typeorm';

@Entity('relationships', { schema: 'osu' })
export class Relationships {
  @Column('int', { primary: true, name: 'user1' })
  user1: number;

  @Column('int', { primary: true, name: 'user2' })
  user2: number;

  @Column('enum', { name: 'type', enum: ['friend', 'block'] })
  type: 'friend' | 'block';
}
