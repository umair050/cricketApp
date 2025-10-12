import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { InvitationsModule } from './invitations/invitations.module';
import { SeederModule } from './seeder/seeder.module';
import { FeedsModule } from './feeds/feeds.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'cricketapp',
      database: process.env.DB_DATABASE || 'cricketapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in development
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    PlayersModule,
    TeamsModule,
    TournamentsModule,
    InvitationsModule,
    SeederModule,
    FeedsModule,
    MatchesModule,
  ],
})
export class AppModule {}