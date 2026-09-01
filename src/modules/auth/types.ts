export declare namespace IApi {
  export interface Login {
    token: string;
    refreshToken: string;
    success: boolean;
  }

  // POST /auth/refresh returns the same payload as /auth/login.
  export interface Refresh {
    token: string;
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
    username: string;
    firstName: string;
    telegramId: number;
    lastName: string | null;
    phoneNumber: string | null;
    role: "ADMIN";
    isActive: boolean;
    createdAt: string;
  }
}

export declare namespace IForm {
  export interface Login {
    username: string;
    password: string;
  }
}

export declare namespace IStore {
  export interface State {
    user: IEntity.User | null;
    error: string | null;
    isAuthenticated: boolean;
    accessToken: string | null;

    logout: () => void;
    login: (session: IEntity.Login) => void;
    setUser: (user: IEntity.User | null) => void;
    setError: (error: string | null) => void;
    setAccessToken: (accessToken: string) => void;
  }
}
