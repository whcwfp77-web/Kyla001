import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../db/entities';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('embed/reindex')
  @ApiOperation({ summary: '重新索引嵌入（管理员）' })
  async reindexEmbeddings(
    @Body() body: { entityType: string; entityIds: string[] },
  ) {
    return this.adminService.reindexEmbeddings(body.entityType, body.entityIds);
  }
}
