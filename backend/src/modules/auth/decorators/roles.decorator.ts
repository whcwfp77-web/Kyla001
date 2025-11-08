import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../db/entities';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
