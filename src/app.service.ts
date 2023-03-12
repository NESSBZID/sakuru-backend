import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TwitchApi from '@alowave223/node-twitch';
import { globalState } from 'src/global.state';
import { HttpService } from './http/http.servce';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger = new Logger(AppService.name),
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Connecting to Twitch...', 'AppBootstrap');

    // Connect to Twitch API.
    globalState.twitchClient = new TwitchApi({
      client_id: this.config.get('TWITCH_CLIENT_ID'),
      client_secret: this.config.get('TWITCH_CLIENT_SECRET'),
    });
    const tiwtchAccessToken = await globalState.twitchClient.getAccessToken();

    // Set default headers for Twitch API.
    this.httpService.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${tiwtchAccessToken}`;
    this.httpService.axiosRef.defaults.headers.common['Client-ID'] =
      this.config.get('TWITCH_CLIENT_ID');
    this.httpService.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';

    this.logger.log('Successfully connected to Twitch!', 'AppBootstrap');
  }
}
