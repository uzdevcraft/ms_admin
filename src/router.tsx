import type { RouteObject } from "react-router-dom";

import queryString from "query-string";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

// layouts
import { MainLayout } from "@/layouts";

// auth container
import { Auth } from "@/modules/auth/containers/Auth";

// not found page
import { NotFound } from "@/components/NotFound";

// pages
import { Categories } from "@/pages/Categories";
import { Dashboard } from "@/pages/Dashboard";
import { Orders } from "@/pages/Orders";
import { Products } from "@/pages/Products";

const getRoutesData = (): RouteObject[] => [
  {
    element: (
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{
          searchStringToObject: queryString.parse,
          objectToSearchString: queryString.stringify,
        }}
      >
        <Auth>
          <MainLayout />
        </Auth>
      </QueryParamProvider>
    ),
    children: [
      {
        path: "/",
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default getRoutesData;
