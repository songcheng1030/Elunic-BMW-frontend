// eslint-disable-next-line
type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K }[keyof T];

// eslint-disable-next-line
type OptionalKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];

type PickRequired<T> = Pick<T, RequiredKeys<T>>;

type PickOptional<T> = Pick<T, OptionalKeys<T>>;

type Nullable<T> = { [P in keyof T]: T[P] | null };

type NullableOptional<T> = PickRequired<T> & Nullable<PickOptional<T>>;

export type UpdateDto<T> = Partial<NullableOptional<T>>;
export type CreateDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
