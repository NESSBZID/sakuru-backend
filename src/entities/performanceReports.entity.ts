import { Column, Entity } from 'typeorm';

@Entity('performance_reports', { schema: 'osu' })
export class PerformanceReports {
  @Column('bigint', { primary: true, name: 'scoreid', unsigned: true })
  scoreid: string;

  @Column('enum', {
    primary: true,
    name: 'mod_mode',
    enum: ['vanilla', 'relax', 'autopilot'],
    default: () => "'vanilla'",
  })
  mod_mode: 'vanilla' | 'relax' | 'autopilot';

  @Column('varchar', { name: 'os', length: 64 })
  os: string;

  @Column('tinyint', { name: 'fullscreen', width: 1 })
  fullscreen: boolean;

  @Column('varchar', { name: 'fps_cap', length: 16 })
  fps_cap: string;

  @Column('tinyint', { name: 'compatibility', width: 1 })
  compatibility: boolean;

  @Column('varchar', { name: 'version', length: 16 })
  version: string;

  @Column('int', { name: 'start_time' })
  start_time: number;

  @Column('int', { name: 'end_time' })
  end_time: number;

  @Column('int', { name: 'frame_count' })
  frame_count: number;

  @Column('int', { name: 'spike_frames' })
  spike_frames: number;

  @Column('int', { name: 'aim_rate' })
  aim_rate: number;

  @Column('tinyint', { name: 'completion', width: 1 })
  completion: boolean;

  @Column('varchar', {
    name: 'identifier',
    nullable: true,
    comment: "really don't know much about this yet",
    length: 128,
  })
  identifier: string | null;

  @Column('int', { name: 'average_frametime' })
  average_frametime: number;
}
