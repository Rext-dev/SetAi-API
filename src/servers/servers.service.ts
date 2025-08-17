import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ServersService {
  getServerSummary(serverId: string) {
    // TODO: Implement with Prisma when database is connected

    // Validate Discord server ID format (18-digit snowflake)
    if (!/^\d{17,19}$/.test(serverId)) {
      throw new NotFoundException('Invalid server ID format');
    }

    // Mock data for now
    return {
      server: {
        id: serverId,
        name: 'My Discord Server',
        description: 'A community server for gaming',
        memberCount: 150,
        owner: {
          id: '111222333444555666',
          username: 'serverowner',
          discriminator: '0001',
        },
        createdAt: new Date('2023-06-15T14:20:00.000Z'),
        icon: 'https://cdn.discordapp.com/icons/...',
        features: ['COMMUNITY', 'WELCOME_SCREEN_ENABLED'],
      },
      botConfiguration: {
        enabled: true,
        configuredAt: new Date('2024-01-01T12:00:00.000Z'),
        lastActivity: new Date('2024-01-15T10:25:00.000Z'),
        commandsEnabled: ['setup-roles', 'manage-channels', 'moderation-tools'],
        commandsDisabled: ['auto-delete', 'welcome-message'],
        settings: {
          prefix: '/',
          autoModeration: true,
          logChannel: '555444333222111001',
          welcomeChannel: '555444333222111002',
        },
      },
      statistics: {
        totalCommands: 245,
        commandsLast24h: 12,
        commandsLast7d: 89,
        topCommands: [
          {
            name: 'setup-roles',
            count: 45,
            lastUsed: new Date('2024-01-15T09:30:00.000Z'),
          },
          {
            name: 'manage-channels',
            count: 38,
            lastUsed: new Date('2024-01-14T16:45:00.000Z'),
          },
        ],
        activeUsers: 23,
        newMembersLast7d: 8,
      },
      channels: {
        total: 25,
        categories: [
          {
            id: '777888999000111222',
            name: 'General',
            channelCount: 5,
          },
          {
            id: '777888999000111223',
            name: 'Gaming',
            channelCount: 8,
          },
        ],
      },
      roles: {
        total: 12,
        managed: [
          {
            id: '444555666777888999',
            name: 'Moderator',
            color: '#ff0000',
            memberCount: 5,
          },
          {
            id: '444555666777889000',
            name: 'Helper',
            color: '#00ff00',
            memberCount: 12,
          },
        ],
      },
      recentActivity: [
        {
          type: 'command_executed',
          timestamp: new Date('2024-01-15T10:25:00.000Z'),
          details: {
            command: 'setup-roles',
            user: 'user123',
            status: 'completed',
          },
        },
        {
          type: 'member_joined',
          timestamp: new Date('2024-01-15T09:45:00.000Z'),
          details: {
            userId: '999888777666555444',
            username: 'newuser',
          },
        },
      ],
    };
  }
}
