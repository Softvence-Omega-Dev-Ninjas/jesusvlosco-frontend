// Define a type for your user (example)
export interface BaseUser {
  id: string;
  name: string;
  email: string;
}

export interface User extends BaseUser {
  avatar?: string;
  phone?: string;
  department?: string;
  lastLogin?: string;
}

// Define a type for your app's theme (example)
export type Theme = "light" | "dark";

// Define a type for your app's routes (example)
export type Route = {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
};
