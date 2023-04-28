import { GameModes } from '@shared/enums/GameModes.enum';

export default interface IUsersGraphsResponse {
  mode: GameModes;
  data: {
    pp: number;
    rank: number;
    country_rank: number;
    captured_at: Date;
  }[];
}
