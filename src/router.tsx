import type { RouteObject } from 'react-router-dom';

import queryString from 'query-string';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

// layouts
import { MainLayout } from '@/layouts';

// auth containers
import { Auth, Guest } from '@/modules/auth/containers';

// not found page
import { NotFound } from '@/components/NotFound';

// pages
import { Categories } from '@/pages/Categories';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Orders } from '@/pages/Orders';
import { Products } from '@/pages/Products';
import { SingleOrder } from '@/pages/SingleOrder';

const getRoutesData = (): RouteObject[] => [
  {
    path: '/login',
    element: (
      <Guest>
        <Login />
      </Guest>
    )
  },
  {
    element: (
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{
          searchStringToObject: queryString.parse,
          objectToSearchString: queryString.stringify
        }}
      >
        <Auth>
          <MainLayout />
        </Auth>
      </QueryParamProvider>
    ),
    children: [
      {
        path: '/',
        index: true,
        element: <Dashboard />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/categories',
        element: <Categories />
      },
      {
        path: '/orders',
        element: <Orders />
      },
      {
        path: '/orders/:id',
        element: <SingleOrder />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default getRoutesData;
