import { Column, Entity } from 'typeorm';

@Entity('ratings', { schema: 'osu' })
export class Ratings {
  @Column('int', { primary: true, name: 'userid' })
  userid: number;

  @Column('char', { primary: true, name: 'map_md5', length: 32 })
  map_md5: string;

  @Column('tinyint', { name: 'rating' })
  rating: number;
}
