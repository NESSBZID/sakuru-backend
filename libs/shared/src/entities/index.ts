import { Achievements } from './achievements.entity';
import { Channels } from './channels.entity';
import { Clans } from './clans.entity';
import { ClientHashes } from './clientHashes.entity';
import { Comments } from './comments.entity';
import { Favourites } from './favourites.entity';
import { IngameLogins } from './ingameLogins.entity';
import { Logs } from './logs.entity';
import { Mail } from './mail.entity';
import { MapRequests } from './mapRequests.entity';
import { Maps } from './maps.entity';
import { Mapsets } from './mapsets.entity';
import { PerformanceReports } from './performanceReports.entity';
import { Ratings } from './ratings.entity';
import { Relationships } from './relationships.entity';
import { Scores } from './scores.entity';
import { Startups } from './startups.entity';
import { Stats } from './stats.entity';
import { TourneyPoolMaps } from './tourneyPoolMaps.entity';
import { TourneyPools } from './tourneyPools.entity';
import { Twitch } from './twitch.entity';
import { UserAchievements } from './userAchievements.entity';
import { Users } from './users.entity';

const entities = [
  Users,
  UserAchievements,
  TourneyPools,
  TourneyPoolMaps,
  Stats,
  Startups,
  Scores,
  Relationships,
  Ratings,
  PerformanceReports,
  Mapsets,
  Maps,
  MapRequests,
  Mail,
  Logs,
  IngameLogins,
  Favourites,
  Comments,
  ClientHashes,
  Clans,
  Channels,
  Achievements,
  Twitch,
];

export {
  Users as UserEntity,
  UserAchievements as UserAchievementEntity,
  TourneyPools as TourneyPoolEntity,
  TourneyPoolMaps as TourneyPoolMapEntity,
  Stats as StatEntity,
  Startups as StartupEntity,
  Scores as ScoreEntity,
  Relationships as RelationshipEntity,
  Ratings as RatingEntity,
  PerformanceReports as PerformanceReportEntity,
  Mapsets as MapsetEntity,
  Maps as MapEntity,
  MapRequests as MapRequestEntity,
  Mail as MailEntity,
  Logs as LogEntity,
  IngameLogins as IngameLoginEntity,
  Favourites as FavouriteEntity,
  Comments as CommentEntity,
  ClientHashes as ClientHashEntity,
  Clans as ClanEntity,
  Channels as ChannelEntity,
  Achievements as AchievementEntity,
  Twitch as TwitchEntity,
};
export default entities;
