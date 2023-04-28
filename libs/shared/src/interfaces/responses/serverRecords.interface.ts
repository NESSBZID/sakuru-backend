import { GameModes } from '@shared/enums/GameModes.enum';

interface IModeRecord {
  username: string;
  userid: number;
  pp: number;
  set_id: number;
  beatmap_id: number;
}

export type IServerRecords = {
  [key in GameModes]: IModeRecord | undefined;
};
