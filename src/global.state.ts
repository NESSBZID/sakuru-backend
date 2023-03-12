import TwitchApi from '@alowave223/node-twitch';
import { IServerRecords } from './v1/interfaces/serverRecords.interface';

interface TwitchStreamer {
  osu_id: number;
  twitch_id: string;
  title: string;
  username: string;
  thumb_url: string;
}

class Global {
  public static twitchClient: TwitchApi;
  public static tiwtchStreamers: TwitchStreamer[] = [];
  public static serverRecords: IServerRecords = {
    relax: undefined,
    standard: undefined,
  };
}

export { Global as globalState };
