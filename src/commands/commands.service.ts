import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../infra/redis/redis.service';
import { ToggleCommandDto } from './dto/toggle-command.dto';
import { CommandHistoryQueryDto } from './dto/command-history-query.dto';

@Injectable()
export class CommandsService {
  constructor(private readonly redisService: RedisService) {}

  getCommandHistory(query: CommandHistoryQueryDto) {
    // TODO: Implement with Prisma when database is connected
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);

    // Mock data for now
    return {
      data: [
        {
          id: 'exec_1234567890',
          command: {
            id: 'cmd_001',
            name: 'setup-roles',
            description: 'Configure server roles',
          },
          user: {
            id: '123456789012345678',
            username: 'user123',
          },
          server: {
            id: '987654321098765432',
            name: 'My Discord Server',
          },
          channel: {
            id: '555444333222111000',
            name: 'general',
          },
          status: 'completed',
          startedAt: new Date('2024-01-15T10:15:00.000Z'),
          completedAt: new Date('2024-01-15T10:15:30.000Z'),
          duration: 30000,
          errorMessage: null,
          metadata: {
            rolesCreated: 5,
            permissions: ['MANAGE_ROLES'],
          },
        },
      ],
      pagination: {
        page,
        limit,
        total: 150,
        totalPages: Math.ceil(150 / limit),
        hasNext: page < Math.ceil(150 / limit),
        hasPrev: page > 1,
      },
    };
  }

  getCommandExecution(id: string) {
    // TODO: Implement with Prisma when database is connected
    if (!id.startsWith('exec_')) {
      throw new NotFoundException('Command execution not found');
    }

    // Mock data for now
    return {
      id,
      command: {
        id: 'cmd_001',
        name: 'setup-roles',
        description: 'Configure server roles',
        enabled: true,
      },
      user: {
        id: '123456789012345678',
        username: 'user123',
        discriminator: '1234',
        avatar: 'https://cdn.discordapp.com/avatars/...',
      },
      server: {
        id: '987654321098765432',
        name: 'My Discord Server',
        memberCount: 150,
        icon: 'https://cdn.discordapp.com/icons/...',
      },
      channel: {
        id: '555444333222111000',
        name: 'general',
        type: 'GUILD_TEXT',
      },
      status: 'completed',
      startedAt: new Date('2024-01-15T10:15:00.000Z'),
      completedAt: new Date('2024-01-15T10:15:30.000Z'),
      duration: 30000,
      errorMessage: null,
      logs: [
        {
          timestamp: new Date('2024-01-15T10:15:05.000Z'),
          level: 'info',
          message: 'Started role configuration',
        },
        {
          timestamp: new Date('2024-01-15T10:15:25.000Z'),
          level: 'info',
          message: "Created role 'Moderator' with permissions",
        },
      ],
      metadata: {
        originalMessage: '/setup-roles moderator admin helper',
        rolesCreated: 5,
        permissions: ['MANAGE_ROLES', 'KICK_MEMBERS'],
        executionSteps: 8,
      },
    };
  }

  async toggleCommand(toggleCommandDto: ToggleCommandDto) {
    // TODO: Update database command state with Prisma

    // Publish toggle event to Redis
    await this.redisService.publish('toggle-command', {
      commandName: toggleCommandDto.commandName,
      enabled: toggleCommandDto.enabled,
      serverId: toggleCommandDto.serverId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      command: {
        name: toggleCommandDto.commandName,
        enabled: toggleCommandDto.enabled,
        serverId: toggleCommandDto.serverId,
        updatedAt: new Date().toISOString(),
      },
      message: 'Command toggle event published successfully',
    };
  }
}
