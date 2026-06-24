/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'WAITING' | 'PREPARED' | 'PAID' | 'CANCELLED' | 'FAILED';

export declare namespace IApi {
  export namespace List {
    export interface Request {
      page?: number;
      size?: number;
    }

    export type Response = IEntity.Order[] | IEntity.PaginatedOrders;
  }

  export namespace Single {
    export type Response = IEntity.Order;
  }

  export namespace MyOrders {
    export type Response = IEntity.Order[];
  }

  export namespace Create {
    export interface Request {
      items: IEntity.OrderItemInput[];
      deliveryAddress?: string;
      comment?: string;
    }

    export type Response = unknown;
  }

  export namespace UpdateStatus {
    export interface Request {
      id: number;
      status: OrderStatus;
    }

    export type Response = unknown;
  }
}

export declare namespace IEntity {
  export interface OrderItemInput {
    productId: number;
    quantity: number;
  }

  export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }

  export interface Payment {
    id: number;
    orderId: number;
    merchantTransId: string;
    amount: number;
    status: PaymentStatus;
    paymentUrl: string;
    createdAt: string;
  }

  export interface Order {
    id: number;
    userId: number;
    userFullName: string;
    status: OrderStatus;
    totalAmount: number;
    deliveryAddress: string;
    comment: string;
    items: OrderItem[];
    payment: Payment | null;
    createdAt: string;
  }

  export interface PaginatedOrders {
    content: Order[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export declare namespace IQuery {
  export interface List {
    data: IEntity.Order[];
    totalElements?: number;
    totalPages?: number;
    page?: number;
    size?: number;
  }

  export interface Single {
    id: number;
  }

  export interface ListParams {
    page?: number;
    size?: number;
  }
}

export declare namespace IForm {
  export interface Create {
    items: IEntity.OrderItemInput[];
    deliveryAddress: string;
    comment: string;
  }

  export interface UpdateStatus {
    status: OrderStatus;
  }
}
