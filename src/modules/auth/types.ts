import { ROLES } from './constants';

export declare namespace IApi {
  export interface Login {
    token: string;
    refreshToken: string;
    success: boolean;
  }

  export interface RefreshResponse {
    accessToken: string;
    refreshToken?: string;
    success: boolean;
  }

  export interface User {}
}

export declare namespace IEntity {
  export interface Login {
    accessToken: string;
    refreshToken: string;
    success: boolean;
  }

  export interface User {
    id: number;
    telegramId: number;
    firstName: string;
    lastName: string | null;
    username: string;
    phoneNumber: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
  }

  export type Role = (typeof ROLES)[keyof typeof ROLES];
}

export declare namespace IStore {
  export interface State {
    user: IEntity.User | null;
    error: string | null;
    isAuthenticated: boolean;
    accessToken: string | null;

    logout: () => void;
    loginSuccess: () => void;
    setAccessToken: (accessToken: string) => void;
  }
}
