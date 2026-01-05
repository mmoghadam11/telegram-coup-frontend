import React from "react";

export interface SubmenuType {
  name: string;
  comp?: string;
  icon: any;
  link: string;
  submenus?: Array<SubmenuType>;
  accessBy?: Array<RoleTypes>;
  accessKeys?: Array<string>;
  permissions?: Array<string>;
  style?: React.CSSProperties;
}

export interface MenuItemsType {
  name: string;
  link?: string;
  comp?: string;
  icon: any;
  disabled?: boolean;
  accessBy?: Array<RoleTypes>;
  permissions?: Array<string>;
  accessKeys?: Array<string>;
  submenus?: Array<SubmenuType>;
  class?: string;
  id?: string;
  style?: React.CSSProperties;
}

export type RoleTypes = "ADMIN" | "USER" | "MANAGER";

export enum RolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
  COMMONBASE = 'COMMONBASE',
}

export enum PersonnelOperationsEnum {
  'PERSONNEL_READ_ALL' = 'personnel:read_all',
  'PERSONNEL_READ' = 'personnel:read',
  'PERSONNEL_DELETE' = 'personnel:delete',
  'PERSONNEL_UPDATE' = 'personnel:update',
  'PERSONNEL_CREATE' = 'personnel:create',
}

export const PersonnelOperations: Array<string> = Object.values(PersonnelOperationsEnum);

export enum CommonBaseOperationsEnum {
  'COMMONBASE_READ_ALL' = 'commonbase:read_all',
  'COMMONBASE_READ' = 'commonbase:read',
  'COMMONBASE_DELETE' = 'commonbase:delete',
  'COMMONBASE_UPDATE' = 'commonbase:update',
  'COMMONBASE_CREATE' = 'commonbase:create',
}

export const CommonBaseOperations: Array<string> = Object.values(CommonBaseOperationsEnum);

/**
 * @description contains Menu keys
 */
export enum RoleKeys {
  PERSONNEL = 'personnel',
  COMMONBASE = 'common-base',
}

export const OperationsEnums = {
  PERSONNEL: PersonnelOperationsEnum,
  COMMONBASE: CommonBaseOperationsEnum,
}

export const Operations = {
  PERSONNEL: PersonnelOperations,
  COMMONBASE: CommonBaseOperations,
}

export type RoleKeyType = keyof typeof OperationsEnums;
