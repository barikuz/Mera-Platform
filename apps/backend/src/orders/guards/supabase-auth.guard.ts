import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseService } from '../../supabase/supabase.service';

type AuthenticatedUser = {
  id: string;
  email?: string;
  [key: string]: unknown;
};

type RequestWithUser = Request & {
  user?: AuthenticatedUser;
};

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;

    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException('Yetkilendirme bilgisi bulunamadi');
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      throw new UnauthorizedException('Gecersiz yetkilendirme bilgisi');
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    request.user = data.user as unknown as AuthenticatedUser;
    return true;
  }
}
