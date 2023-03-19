import TwitchApi from '@alowave223/node-twitch';
import { TwitchStreamer } from './interfaces/twitchStreamer.interface';

class Global {
  public static twitchClient: TwitchApi;
  public static tiwtchStreamers: TwitchStreamer[] = [];
}

export { Global as globalState };
