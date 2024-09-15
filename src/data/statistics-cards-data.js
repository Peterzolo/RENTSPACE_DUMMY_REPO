import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

const allUserDataString = localStorage.getItem('all_users');
const userData = JSON.parse(allUserDataString);
const allUserRentsString = localStorage.getItem('all_rents');
const rentData = JSON.parse(allUserRentsString);
const allUserWalletString = localStorage.getItem('all_wallet');
const walletData = JSON.parse(allUserWalletString);
const rentTotalString = localStorage.getItem('rent_total');
const rentTotalDataData = JSON.parse(rentTotalString);
export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Total Users",
    value: userData?.length || 0,
    footer: {
      color: "text-green-500",
      value: "+0%",
      // label: "than last week",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total SpaceRents",
    value: rentData?.length || 0,
    footer: {
      color: "text-green-500",
      value: "+0%",
      // label: "than last month",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Funded Wallets",
    value: walletData?.filter(item => item.mainBalance > 0).length || 0,
    footer: {
      color: "text-red-500",
      value: "0%",
      // label: "than yesterday",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Rent Wallet",
    value:`\u20A6${rentTotalDataData}` || 0,
    footer: {
      color: "text-green-500",
      value: "+0%",
      // label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
