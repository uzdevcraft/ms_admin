/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

import type { Types as OrderTypes } from '@modules/orders';
import type { Types as ProductTypes } from '@modules/products';

export type UserRole = 'USER' | 'ADMIN';

export declare namespace IApi {
  export namespace Login {
    export interface Request {
      telegramId: number;
    }

    export interface Response {
      token: string;
      tokenType: string;
      success: boolean;
    }
  }

  export namespace Me {
    export type Response = IEntity.Profile;
  }

  export namespace MyOrders {
    export type Response = OrderTypes.IEntity.Order[];
  }

  export namespace CreateOrder {
    export type Request = OrderTypes.IApi.Create.Request;
    export type Response = unknown;
  }

  export namespace ListProducts {
    export type Response = ProductTypes.IEntity.Product[];
  }

  export namespace CreatePayment {
    export interface Request {
      orderId: number;
    }

    export type Response = IEntity.Payment;
  }
}

export declare namespace IEntity {
  export interface Profile {
    id: number;
    telegramId: number;
    firstName: string;
    lastName: string | null;
    username: string;
    phoneNumber: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  }

  export interface Payment {
    id: number;
    orderId: number;
    merchantTransId: string;
    amount: number;
    status: string;
    paymentUrl: string;
    createdAt: string;
  }
}

export declare namespace IQuery {
  export interface Login {
    telegramId: number;
  }

  export interface CreatePayment {
    orderId: number;
  }
}

export type { OrderTypes, ProductTypes };
