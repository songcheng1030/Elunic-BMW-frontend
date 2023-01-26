import { BaseDto } from './base';

export interface FileDto extends BaseDto {
  fileName: string;
  refIds: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  size: number;
  contentType: string;
  privateUrl: string;
}

export interface CreateFileDto {
  file: File;
  refIds: string[];
  tags: string[];
}

export interface FileMetadataDto extends BaseDto {
  name: string;
  refIds: [];
  tags: [];
  size: number;
  mime: string;
  createdAt: Date;
  updatedAt: Date;
  exif: null;
  extended: {
    url: string;
    urlTokenized: string;
    urlThumbnailTokenized: string;
    iat: Date;
  };
}

export const LOCKED_TAG = 'locked';

export interface Costs {
  EUR: number;
  USD: number;
}

export interface CombinationForCosts {
  S: {
    S: Costs;
    M: Costs;
    L: Costs;
  };
  M: {
    S: Costs;
    M: Costs;
    L: Costs;
  };
  L: {
    S: Costs;
    M: Costs;
    L: Costs;
  };
}

export interface CombinationData {
  combination_implementation: CombinationForCosts;
  combination_yearly: CombinationForCosts;
}
