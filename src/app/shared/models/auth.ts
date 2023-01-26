import { UserRole } from './user';

export interface JWTPayload {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  email: string;
  groups: UserRole[];
  iat: 1516239022;
}
