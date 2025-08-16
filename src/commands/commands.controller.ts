import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { ToggleCommandDto } from './dto/toggle-command.dto';
import { CommandHistoryQueryDto } from './dto/command-history-query.dto';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Get('history')
  getCommandHistory(@Query() query: CommandHistoryQueryDto) {
    return this.commandsService.getCommandHistory(query);
  }

  @Get(':id')
  getCommandExecution(@Param('id') id: string) {
    return this.commandsService.getCommandExecution(id);
  }

  @Post('toggle')
  async toggleCommand(@Body() toggleCommandDto: ToggleCommandDto) {
    return this.commandsService.toggleCommand(toggleCommandDto);
  }
}
