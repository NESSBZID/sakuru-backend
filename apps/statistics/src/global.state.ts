import { GameModes } from '@shared/enums/GameModes.enum';
import { IServerRecords } from './interfaces/serverRecords.interface';
import { IServerStats } from './interfaces/serverStats.interface';

class Global {
  public static serverRecords: IServerRecords = {
    [GameModes.VANILLA_OSU]: undefined,
    [GameModes.VANILLA_TAIKO]: undefined,
    [GameModes.VANILLA_CATCH]: undefined,
    [GameModes.VANILLA_MANIA]: undefined,
    [GameModes.RELAX_OSU]: undefined,
    [GameModes.RELAX_TAIKO]: undefined,
    [GameModes.RELAX_CATCH]: undefined,
    [GameModes.AUTOPILOT_OSU]: undefined,
  };

  public static serverStats: IServerStats = {
    players_total: 0,
    players_online: 0,
    multiplayer_matches: 0,
    custom_ranked_maps_count: 0,
  };
}

export { Global as globalState };
