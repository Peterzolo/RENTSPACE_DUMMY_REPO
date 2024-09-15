import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Accounts, Notifications,SpaceRent, Wallets,SessionHistory,BVN,BVNPayments,KYC,Referrals,ActiveSubscriptions,Announcements,DVAManagement,WatuReceipts,Withdrawals, Analytics, Transactions, Utilities } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import SpaceDeposit from "./pages/dashboard/SpaceDeposit";

const icon = {
  className: "w-5 h-5 text-[#145182]",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "analytics",
      //   path: "/analytics",
      //   element: <Analytics />,
      // },

      {
        icon: <TableCellsIcon {...icon} />,
        name: "Informations",
        path: "/customers",
        element: <Accounts />,
        dropdown: [
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "Customers",
            path: "/customers",
            element: <Accounts />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "wallets",
            path: "/wallets",
            element: <Wallets />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "Virtual Accounts",
            path: "/virtual_accounts",
            element: <DVAManagement />,
          },
        ]
      },
   
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Transactions",
        path: "/transactions",
        element: <Transactions />,
        dropdown: [
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "All Transactions",
            path: "/all-transactions",
            element: <Transactions />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "Utilities",
            path: "/utilities",
            element: <Utilities />,
          },
          {
            icon: <InformationCircleIcon {...icon} />,
            name: "Transfer",
            path: "/Transfer",
            element: <Withdrawals />,
          },
        ]
      },
   
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "bvn",
        path: "/bvn",
        element: <BVN />,
      },

      {
        icon: <InformationCircleIcon {...icon} />,
        name: "space Rents",
        path: "/spacerents",
        element: <SpaceRent />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "space Deposit",
        path: "/space_deposit",
        element: <SpaceDeposit/>,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "session history",
        path: "/session_history",
        element: <SessionHistory />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "session history",
      //   path: "/wallet/user-transactions/:userId",
      //   element: <SessionHistory />,
      // },
    ],
  },

];

export default routes;
