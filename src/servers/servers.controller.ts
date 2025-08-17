import { Controller, Get, Param } from '@nestjs/common';
import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get(':id/summary')
  getServerSummary(@Param('id') id: string) {
    return this.serversService.getServerSummary(id);
  }
}
