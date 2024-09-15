import React,{ useState,useEffect }  from "react";
import moment from 'moment';

import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Avatar,

} from "@material-tailwind/react";

import { StatisticsCard } from "@/widgets/cards";

import Cookies from 'universal-cookie';
import Fallback from "@/components/FallBack";
import axios from 'axios';
import { BanknotesIcon, ChartBarIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { formatNaira } from "@/utils/currencyFormatter";
// import { localBaseUrl } from "@/utils/api";

export function Home() {
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [rentTotal, setRentTotal] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [rentWallet, setrentWallet] = useState([]);
  const [fundedWallets, setFundedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const token = cookies.get('token');

  const totalWalletBalance = fundedWallets.reduce((total, wallet) => total + wallet?.mainBalance, 0);

  const fetchAllUsers = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    try {
      const response = await axios.get(
        'https://rentspacetech.com/api/user/get-users',
        // `${localBaseUrl }/user/get-users`,
     
       
 
        { headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`} }
      );
      const results = await response.data;
      console.log('results here');
      console.log(results);
      setData(results);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching info:', error.message);
      setIsLoading(false);
    }
  };

  const fetchRentTotal = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    try {
      const response = await axios.get(
        'https://rentspacetech.com/api/rent/get-rentTotal',
        // `${localBaseUrl }/rent/get-rentTotal`,
     
       
   
        { headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`} }
      );
      const results = await response.data;
    ;
      setrentWallet(results.total_payment);

      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching rent payment:', error.message);
      setIsLoading(false);
    }
  };

  const fetchAllWallets = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    try {
      const response = await axios.get(
        'https://rentspacetech.com/api/wallet/get-wallets',
        // `${localBaseUrl }/wallet/get-wallets`,
     

        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      const results = await response.data;
      setFundedWallets(results.wallets);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching wallets info:', error.message);
      setIsLoading(false);
    }
  };

  const fetchAllRents = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };
    try {
        const response = await axios.get(
            'https://rentspacetech.com/api/rent/get-rents',
            // `${localBaseUrl}/rent/get-rents`,
         

        
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
        );
        const results = await response.data;
        setRentTotal(results.rents);
        setIsLoading(false);
    } catch (error) {
        console.log('Error fetching rents:', error.message);
        setIsLoading(false);
    }
};
  const fetchAllDeposits = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    try {
        const response = await axios.get(
          'https://rentspacetech.com/api/all-space-deposits',
            // `${localBaseUrl}/rent/get-rents`,
        
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
        );
        const results = await response.data;
        setDeposits(results.deposits);
        setIsLoading(false);
    } catch (error) {
        console.log('Error fetching rents:', error.message);
        setIsLoading(false);
    }
};

  useEffect(() => {
    fetchAllUsers();
    fetchRentTotal();
    fetchAllWallets();
    fetchAllRents();
    fetchAllDeposits();
  }, []);

  const totalCurrentBalance = deposits?.reduce((sum, deposit) => {
    return sum + (deposit?.currentBalance || 0); 
  }, 0);

  const totalDeposits = deposits?.length || 0



  
// Calculate the total currentBalance for fixed and flexible types
const totalFixedAmount = deposits&& deposits.reduce((sum, deposit) => {
  return deposit.type === "fixed" ? sum + (deposit.currentBalance || 0) : sum;
}, 0);

const totalFlexibleAmount = deposits&& deposits.reduce((sum, deposit) => {
  return deposit.type === "flexible" ? sum + (deposit.currentBalance || 0) : sum;
}, 0);




  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
      <StatisticsCard
          key="Total Users"
          color="blue"
          
            title="Total Users"
            icon={React.createElement(UsersIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+{data.newUsersPercentageLastSevenDays}%</strong>
                &nbsp; than last week
              </Typography>
            }
          

          value={
            <span className="text-sm">{data.users?.length || 0}</span>  // Add custom font size here
          }
          />
      <StatisticsCard
          key="Users in the last 7 Days"
          color="blue"
          
            title="Users in the last 7 Days"
            icon={React.createElement(UsersIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                {/* <strong className="text-green-500">+{data.newUsersPercentageLastSevenDays}%</strong>
                &nbsp; than last week */}
              </Typography>
            }
       
          value={
            <span className="text-sm">{data.newUsersCountLastSevenDays}</span>
          }
          />
      <StatisticsCard
          key="Funded Wallets"
          color="blue"
          
            title="Funded Wallets"
            icon={React.createElement(ChartBarIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
          value={
            <span className="text-sm">{fundedWallets?.filter(item => item.mainBalance > 0).length || 0} </span>
          }
          
          />
      <StatisticsCard
          key="Total Rents"
          color="blue"
          
            title="Total Rents"
            icon={React.createElement(UserPlusIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
      
          value={
            <span className="text-sm">{rentTotal.length || 0}</span> 
          }
          />
      <StatisticsCard
          key="Total Deposits"
          color="blue"
            title="Total Deposits"
            icon={React.createElement(UserPlusIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
      
          value={
            <span className="text-sm">{totalDeposits}</span> 
          }
          />
      <StatisticsCard
          key="Rent Wallet"
          color="blue"
          
            title="Rent Wallet"
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
         
      
          value={
            <span className="text-sm">{formatNaira(rentWallet)}</span>  // Add custom font size here
          }
          />
      <StatisticsCard
          key="Deposit Wallet"
          color="blue"
          
            title="Deposit Wallet"
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
         
      
          value={
            <span className="text-sm">{formatNaira(totalCurrentBalance)}</span>  // Add custom font size here
          }
          />
      <StatisticsCard
          key="Space Wallet"
          color="blue"
            title="Space Wallet"
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
       
          value={
            <span className="text-sm">{formatNaira(totalWalletBalance)}</span>  // Add custom font size here
          }

          />
      <StatisticsCard
          key="Total Fixed Deposits"
          color="blue"
            title="Total Fixed Deposits"
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
       
          value={
            <span className="text-sm">{formatNaira(totalFixedAmount)}</span>  // Add custom font size here
          }

          />
      <StatisticsCard
             key="Total Flexible Deposits"
          color="blue"
            title="Total Flexible Deposits"
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
       
          value={
            <span className="text-sm">{formatNaira(totalFlexibleAmount)}</span>  // Add custom font size here
          }

          />
        
      </div>
      <Card className="">
        <CardHeader  color="gray" className="mb-8 p-6 bg-[#145182]">
          <Typography variant="h6" color="white">
            Users
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["S/N","user", "Role", "Phone Number","status", "joined"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users?.map(
                ({ avatar, firstName,lastName, email, phoneNumber, active, date,role,...rest }, key) => {
                  const className = `py-3 px-5 ${
                    key === data.users?.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={firstName + Math.random()}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                          {key + 1}
                        </Typography>
                        
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={avatar['url']} alt={firstName} size="sm" variant="rounded" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold capitalize"
                            >
                             {lastName} {firstName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                          {role}
                        </Typography>
                        
                      </td>
                      <td className={className}>
                        
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {phoneNumber}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={active ? "green" : "blue-gray"}
                          value={active ? "active" : "Inactive"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          { moment(date).format('MMMM Do YYYY, h:mm:ss a')}
                          
                        </Typography>
                      </td>
                      
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {/* <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default Home;
