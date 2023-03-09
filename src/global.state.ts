import TwitchApi from '@alowave223/node-twitch';

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
}

export { Global as globalState };
