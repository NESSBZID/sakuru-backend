import { ModeFilter } from './v1/enums/ModeFilter.enum';
import { ModsFilter } from './v1/enums/ModsFilter.enum';

export function makeSafeName(unsafe_name: string): string {
  return unsafe_name.replace(/[^a-zA-Z0-9]/g, '_');
}

export function checkValidModsCombination(
  mode: ModeFilter,
  mods: ModsFilter,
): boolean {
  switch (mods) {
    case ModsFilter.vanilla:
      return (
        mode === ModeFilter.osu ||
        mode === ModeFilter.taiko ||
        mode === ModeFilter.catch ||
        mode === ModeFilter.mania
      );
    case ModsFilter.relax:
      return (
        mode === ModeFilter.osu ||
        mode === ModeFilter.catch ||
        mode === ModeFilter.mania
      );
    case ModsFilter.autopilot:
      return mode === ModeFilter.osu;
    default:
      return false;
  }
}
