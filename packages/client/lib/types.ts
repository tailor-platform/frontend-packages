/* eslint-disable  @typescript-eslint/no-explicit-any */

type D = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `19${D}${D}` | `20${D}${D}`;
type MM = `0${Exclude<D, 0>}` | `1${1 | 2}`;
type DD = `0${Exclude<D, 0>}` | `${1 | 2}${D}` | `3${0 | 1}`;
type HT = `0${D}` | `${D}${D}`;
type MT = `0${D}` | `${1 | 2 | 3 | 4 | 5}${D}`;

export type TailorGqlDate = `${YYYY}-${MM}-${DD}`;
export type TailorGqlTime = `${HT}:${MT}`;

export type Maybe<T> = T | null;

/** Gender type based on ISO 5218. */
export enum Gender {
  /** female */
  Female = "Female",
  /** male */
  Male = "Male",
  /** not applicable */
  NotApplicable = "NotApplicable",
  /** not known */
  NotKnown = "NotKnown",
}

export type UserRole = {
  createdAt?: Maybe<Scalars["DateTime"]>;
  endAt?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["ID"]>;
  role?: Maybe<Role>;
  startAt?: Maybe<Scalars["DateTime"]>;
};

export type UserProfile = {
  birthday?: Maybe<Scalars["DateTime"]>;
  city?: Maybe<Scalars["String"]>;
  costCenter?: Maybe<Scalars["String"]>;
  countryCode?: Maybe<Scalars["String"]>;
  createdAt: Scalars["DateTime"];
  department?: Maybe<Scalars["String"]>;
  displayName?: Maybe<Scalars["String"]>;
  division?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  employeeCode?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  gender?: Maybe<Gender>;
  honorificPrefix?: Maybe<Scalars["String"]>;
  honorificSuffix?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  joinedAt?: Maybe<Scalars["DateTime"]>;
  lastName?: Maybe<Scalars["String"]>;
  leftAt?: Maybe<Scalars["DateTime"]>;
  locale?: Maybe<Scalars["String"]>;
  middleName?: Maybe<Scalars["String"]>;
  mobilePhone?: Maybe<Scalars["String"]>;
  nickName?: Maybe<Scalars["String"]>;
  organizationID?: Maybe<Scalars["ID"]>;
  preferredLanguage?: Maybe<Scalars["String"]>;
  primaryPhone?: Maybe<Scalars["String"]>;
  profileUrl?: Maybe<Scalars["String"]>;
  secondEmail?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  streetAddress?: Maybe<Scalars["String"]>;
  timezone?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  userType?: Maybe<Scalars["String"]>;
  userTypeId?: Maybe<Scalars["ID"]>;
  username?: Maybe<Scalars["String"]>;
  zipCode?: Maybe<Scalars["String"]>;
};

/** A list of User. */
export type UserCollection = {
  /** Information to aid in pagination. */
  collection: Array<User>;
  from: Scalars["Int"];
  size: Scalars["Int"];
  /** Information to aid in pagination. */
  total: Scalars["Int"];
};

/** Attributes of Role. */
export type RoleClass = {
  /** ID of the RoleClass. */
  id: Scalars["ID"];
  /** Name of the RoleClass. */
  name?: Maybe<Scalars["String"]>;
};

export type Service = {
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  url?: Maybe<Scalars["String"]>;
};

export type ConditionStrValue = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type ConditionIdValue = {
  key: Scalars["String"];
  value: Scalars["ID"];
};

export type ConditionIdValueInput = {
  key: Scalars["String"];
  value: Scalars["ID"];
};

export type ConditionIntValue = {
  key: Scalars["String"];
  value: Scalars["Int"];
};

/** TODO */
export type Condition = {
  IntEq?: Maybe<ConditionIntValue>;
  IntGe?: Maybe<ConditionIntValue>;
  IntGt?: Maybe<ConditionIntValue>;
  IntLe?: Maybe<ConditionIntValue>;
  IntLt?: Maybe<ConditionIntValue>;
  IntNeq?: Maybe<ConditionIntValue>;
  StrContains?: Maybe<ConditionStrValue>;
  StrEq?: Maybe<ConditionStrValue>;
  StrNeq?: Maybe<ConditionStrValue>;
  UUIDEq?: Maybe<ConditionIdValue>;
  UUIDNeq?: Maybe<ConditionIdValue>;
  id: Scalars["ID"];
};

/** TODO */
export enum Permit {
  /** Allow */
  Allow = "allow",
  /** Deny */
  Deny = "deny",
  /** Skip */
  Skip = "skip",
}

/** A Policy is a collection of combinations of e.g, roles. */
export type Policy = {
  /** Actions assigned to the policy. */
  actions?: Maybe<Array<Scalars["String"]>>;
  /** Condition assigned to the policy. */
  condition?: Maybe<Condition>;
  /** Timestamp when the policy was created. */
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  /** Password rule assigned to the policy. */
  passwordRule?: Maybe<Scalars["Int"]>;
  /** Permit assigned to the policy. */
  permit: Permit;
  /** Resources assigned to the policy. */
  resources?: Maybe<Array<Scalars["String"]>>;
  /** Roles assigned to the policy. */
  roles?: Maybe<Array<Role>>;
  /** Service assigned to the policy. */
  service?: Maybe<Service>;
  /** Timestamp when the policy was last updated. */
  updatedAt?: Maybe<Scalars["DateTime"]>;
};

/** A list of Group. */
export type GroupCollection = {
  /** A list of groups. */
  collection: Array<Group>;
  from: Scalars["Int"];
  size: Scalars["Int"];
  /** Information to aid in pagination. */
  total: Scalars["Int"];
};

/** A group on Tailor Plafform. */
export type Group = {
  /** Base role of the group. */
  baseRole?: Maybe<Role>;
  /** Children of the group (id any). */
  children?: Maybe<GroupCollection>;
  /** Code of the group. */
  code?: Maybe<Scalars["String"]>;
  /** Timestamp when the group was created. */
  createdAt: Scalars["DateTime"];
  /** ID of the group */
  id: Scalars["ID"];
  /** Returns TRUE if the group is a leaf (at level 0). */
  isLeaf: Scalars["Boolean"];
  /** Name of the group. */
  name: Scalars["String"];
  /** ID of the organization associated with the group. */
  organizationID: Scalars["ID"];
  /** Parent of the group (if any). */
  parent?: Maybe<Group>;
  /** Representative role of the group. */
  representativeRole?: Maybe<Role>;
  /** Timestamp when the group was last updated. */
  updatedAt?: Maybe<Scalars["DateTime"]>;
  /** List of the users associated with the group. */
  users?: Maybe<UserCollection>;
};

export type Role = {
  /** Timestamp when the role was created. */
  createdAt: Scalars["DateTime"];
  /** ID of the role. */
  id: Scalars["ID"];
  /** name */
  name: Scalars["String"];
  /** ID of the organization associated with the role. */
  organizationID: Scalars["ID"];
  /** A list of policies associated with the role. */
  policies?: Maybe<Array<Policy>>;
  /** Roleclass. */
  roleClass: RoleClass;
  /** Timestamp when the role was last updated. */
  updatedAt?: Maybe<Scalars["DateTime"]>;
  /** A list of users associated with the role. */
  users: UserCollection;
};

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: TailorGqlDate;
  DateTime: any;
  FieldSet: any;
  JSON: any;
  Map: any;
  Time: TailorGqlTime;
  Uint32: any;
  _Any: any;
};

export type UserGroup = {
  createdAt?: Maybe<Scalars["DateTime"]>;
  endAt?: Maybe<Scalars["DateTime"]>;
  group?: Maybe<Group>;
  id?: Maybe<Scalars["ID"]>;
  startAt?: Maybe<Scalars["DateTime"]>;
};

export type User = {
  createdAt: Scalars["DateTime"];
  deletedAt?: Maybe<Scalars["DateTime"]>;
  displayName: Scalars["String"];
  groups: Array<Group>;
  id: Scalars["ID"];
  lastLoggedInAt?: Maybe<Scalars["DateTime"]>;
  organizationID: Scalars["ID"];
  profile?: Maybe<UserProfile>;
  roles: Array<Role>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  userGroups: Array<UserGroup>;
  userRoles: Array<UserRole>;
  username: Scalars["String"];
  additionalData?: any;
};
