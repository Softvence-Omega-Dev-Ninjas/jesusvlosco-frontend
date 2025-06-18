// src/interfaces.ts
export interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  lastLogin: string;
}

export interface ColumnOption {
  label: string;
  checked: boolean;
}

export interface ActionOption {
  label: string;
  icon: string;
}
