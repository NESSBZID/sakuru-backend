import { GameModes } from '@shared/enums/GameModes.enum';
import { IServerRecords } from '../../../libs/shared/src/interfaces/responses/serverRecords.interface';
import IServerStats from '@shared/interfaces/responses/serverStats.interface';

class Global {
  public static serverRecords: IServerRecords = {
    [GameModes['vn!std']]: undefined,
    [GameModes['vn!taiko']]: undefined,
    [GameModes['vn!catch']]: undefined,
    [GameModes['vn!mania']]: undefined,
    [GameModes['rx!std']]: undefined,
    [GameModes['rx!taiko']]: undefined,
    [GameModes['rx!catch']]: undefined,
    [GameModes['ap!std']]: undefined,
  };

  public static serverStats: IServerStats = {
    players_total: 0,
    players_online: 0,
    multiplayer_matches: 0,
    custom_ranked_maps_count: 0,
  };
}

export { Global as globalState };
