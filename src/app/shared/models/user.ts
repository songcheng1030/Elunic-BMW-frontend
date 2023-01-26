export type UserRole = 'AIQX_TEAM' | 'REQUESTOR';

export interface UserDto {
  id: string;
  displayName: string;
  username: string;
  givenName: string;
  familyName: string;
  mail: string;
}

export interface UserDtoWithRoles extends UserDto {
  roles: UserRole[];
}

export const SUPPORTED_LANGS = ['de', 'en'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
