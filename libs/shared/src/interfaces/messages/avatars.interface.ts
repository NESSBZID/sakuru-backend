export interface IAvatarsSetMessage {
  user_id: number;
  image: Buffer;
}

export interface IAvatarsDeleteMessage {
  user_id: number;
}
