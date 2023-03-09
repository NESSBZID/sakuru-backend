import { Column, Entity } from 'typeorm';

@Entity('favourites', { schema: 'osu' })
export class Favourites {
  @Column('int', { primary: true, name: 'userid' })
  userid: number;

  @Column('int', { primary: true, name: 'setid' })
  setid: number;

  @Column('int', { name: 'created_at', default: 0 })
  created_at: number;
}
