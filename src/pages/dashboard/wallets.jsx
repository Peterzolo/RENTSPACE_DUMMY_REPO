import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import { EllipsisVerticalIcon, EyeIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Cookies from 'universal-cookie';
import Fallback from "@/components/FallBack";
import axios from 'axios';
import { WalletFilter } from "@/widgets/layout";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { AdjustmentsVerticalIcon, BanknotesIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import { StatisticsCard } from "@/widgets/cards";
// import { localBaseUrl } from "@/utils/api";

export function Wallets() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Holds the list of tasks
  const [historyData, setHistoryData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [isHistoryLoading, setIsHistoryLoading] = useState(false); // Indicates whether the data is being loaded
  // SIDEBAR
  const [controller, dispatch] = useMaterialTailwindController();
  const [filters, setFilters] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const userDataString = localStorage.getItem('user_info');
  const userData = JSON.parse(userDataString);
  const handleViewWallet = (wallet) => {
    setSelectedWallet(wallet);
  };
  const handleViewHistory = (userId) => {
    // setSelectedHistory(userId);
    // console.log(userId);
    // fetchUserHistories(userId);
    navigate(`/wallet/user-transactions/${userId}`);
  };

  const handleCloseModal = () => {
    setSelectedWallet(null);
    setSelectedHistory(null);
  };



  const token = cookies.get('token');
  //console.log('token');

  console.log('***')

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
        // `${localBaseUrl}/wallet/get-wallets`,
   

        // requestOptions
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      const results = await response.data;
      console.log(results);
      setData(results);
      // setUserId(results._id);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching wallets info:', error.message);
      setIsLoading(false);
    }
  };
  const fetchUserHistories = async (userId) => {
    setIsHistoryLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
 
    try {
      const response = await axios.get(
        `https://rentspacetech.com/api/wallet/user-transactions?userId=${userId}`,
        // `${localBaseUrl}/wallet/user-transactions?userId=${userId}`,
     


        // requestOptions
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      const results = await response.data;
      console.log(results.user);
      setHistoryData(results);
      setIsHistoryLoading(false);
    } catch (error) {
      console.log('Error fetching wallets info:', error.message);
      setIsHistoryLoading(false);
    }
  };
  // const handleSearch = async (e) => {
    // e.preventDefault(); // Prevent form submission
    // setIsLoading(true);
    // try {
    //     const response = await axios.get(
    //         `https://rentspacetech.com/api/wallet/transactions?search=${searchQuery}`,
    //         { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
    //     );
    //     console.log(response);
    //     setData(response.data.walletHistories);
    //     setIsLoading(false);
    // } catch (error) {
    //     console.log('Error searching Transactions:', error.message);
    //     setIsLoading(false);
    // }
  // };
  const downloadCSV = () => {
    const csvContent = [
      "Index,User,Wallet Id,Balance,Space Point balance,Creation Date, Updated On",
      ...data.wallets.map(({ user, walletId, mainBalance, createdAt, availableBalance, updatedAt }, index) => (
        `${index + 1},"${user?.lastName || ""} ${user?.firstName || "Deleted User"}","${walletId}","${mainBalance}","${availableBalance}","${moment(createdAt).format('DD/MM/YYYY')}","${moment(updatedAt).format('DD/MM/YYYY')}"`
      ))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'wallets.csv');
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(prevIsSidebarOpen => {
      console.log('dash');
      console.log('prevIsSidebarOpen:', prevIsSidebarOpen);
      if (!prevIsSidebarOpen) {
        console.log('Sidebar is closed');
        console.log('Filters:', filters);
      }
      return false; // Close the sidebar
    });
  };

  useEffect(() => {
    fetchAllWallets();


  }, []);

  if (isLoading) {
    return <Fallback />;
  }
  return (<div className="mt-12 mb-8 flex flex-col gap-12">
  
    {userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account' ? <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> :
      <>
        <div className="mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          <StatisticsCard
            key="Account Balance"
            color="blue"

            title="Account Balance"
            icon={React.createElement(BanknotesIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className="text-green-500">+0%</strong>
                &nbsp; than last week
              </Typography>
            }
            value={Intl.NumberFormat('en-DE', {
              style: 'currency',
              currency: 'NGN',
              useGrouping: true,
            }).format(data.totalAmount)}
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
            value={data.wallets?.filter(item => item.mainBalance > 0).length || 0}
          />


        </div>
        <Card>
          <WalletFilter filters={filters} setFilters={setFilters} onCloseSidebar={handleSidebarClose} />
          <IconButton
            size="lg"
            // color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray bg-[#145182]"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <AdjustmentsVerticalIcon className="h-5 w-5" />
          </IconButton>
          <CardHeader color="gray" className="mb-8 p-6 bg-[#145182]">
            <Typography variant="h6" color="white">
              Wallets
            </Typography>
          </CardHeader>
          <div className='flex justify-between flex-row my-4 px-6'>

            {/* <form className="flex items-start max-w-lg">
              <label htmlFor="default-search" className="sr-only">Search</label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="default-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#145182] focus:border-[#145182] block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#145182] dark:focus:border-[#145182]" placeholder="Search Transactions..." required />
              </div>
              <button onClick={handleSearch} className="inline-flex items-center py-2.5 px-6 ms-2 text-sm font-medium text-white bg-[#145182] rounded-lg border border-[#145182] hover:bg-blue-800   dark:hover:bg-[#145182]">
                Search
              </button>
            </form> */}

            <button type="button" className="text-white bg-[#145182] hover:bg-[#145182] focus:outline-none  font-medium rounded-full text-sm px-16 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-[#145182] dark:focus:ring-[#145182]" onClick={downloadCSV}>Export Data</button>
          </div>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Index", "User", "Wallet ID", "Main Balance","Space Points","Monthly Interest", "Wallet Interest","Referral Points", "Created On", "More", "History"].map(
                    (el) => (
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.wallets.map(
                  (wallet, index) => {
                    const className = `py-3 px-5 ${index === data.wallets.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                      }`;

                    return (
                      <tr key={wallet.walletId}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                            {index + 1}
                          </Typography>

                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            {/* <Avatar src={img} alt={name} size="sm" /> */}
                            {/* {user &&  */}
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {wallet.user?.lastName || ""} {wallet.user?.firstName || "Deleted User"}
                            </Typography>
                            {/* } */}
                          </div>
                        </td>

                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {wallet.walletId}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {Intl.NumberFormat('en-DE', {
                              style: 'currency',
                              currency: 'NGN',
                              useGrouping: true,
                            }).format(wallet.mainBalance)}
                            {/* &#8358; {wallet.mainBalance.toFixed(2)} */}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                         {wallet.user?.utility_points}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                         {wallet.monthlyAccumulatedInterest}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                         {wallet.accumulatedInterest}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                         {wallet?.user?.referralPoints}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {moment(wallet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}

                          </Typography>
                        </td>
                      
                        <td className={className}>
                          <EyeIcon
                            className="text-blue-500 cursor-pointer w-5 h-5"
                            onClick={() => handleViewWallet(wallet)}
                          />
                        </td>
                        <td className={className}>
                          <ArrowUpRightIcon
                            className="text-blue-500 cursor-pointer w-5 h-5"
                            onClick={() => handleViewHistory(wallet.user?._id)}
                          />
                        </td>



                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        {/* Modal or dropdown to display detailed wallet info */}
        {selectedWallet && (

          <div id="progress-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-[#145182] rounded-lg shadow dark:bg-gray-700">
                <button type="button" onClick={handleCloseModal} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="progress-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5">
                  <div className="max-w-full sm:w-[4rem] sm:h-[4rem] xl:w-[4rem] xl:h-[4rem] rounded-full border border-button flex items-center justify-center shrink-0 grow-0 w-[4rem] h-[4rem]">

                    <img src={selectedWallet.user?.avatar.url} className="w-[90%] h-[90%] rounded-full bg-button object-cover inline mx-2" alt="" />
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-white dark:text-white capitalize inline">{selectedWallet.user?.lastName} {selectedWallet.user?.firstName} : <span className="text-base font-light">{selectedWallet.walletId}</span></h3>
                  <p className="text-base font-medium text-white my-2 dark:text-white">Main Balance: {Intl.NumberFormat('en-DE', {
                    style: 'currency',
                    currency: 'NGN',
                    useGrouping: true,
                  }).format(selectedWallet.mainBalance)}</p>
                  <p className="text-base font-medium text-white my-2 dark:text-white">Space Points: {selectedWallet.user?.utility_points}</p>
                  <p className="text-base font-medium text-white my-2 dark:text-white">Created On: {moment(selectedWallet.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                  <p className="text-base font-medium text-white my-2 dark:text-white">Updated On: {moment(selectedWallet.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {isHistoryLoading && (
          <Fallback />
        )}
        {selectedHistory && !isHistoryLoading &&
          (


            <div id="progress-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
              <div className=" p-4 w-full max-w-2xl max-h-full items-center">
                <div className="relative bg-[#145182] rounded-lg shadow dark:bg-gray-700">
                  <button type="button" onClick={handleCloseModal} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="progress-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full  table-auto">
                      <thead>
                        <tr>
                          {["Index", "User", "Wallet ID", "Main Balance", "Created On", "Updated On", "More", "History"].map(
                            (el) => (
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
                            )
                          )}
                        </tr>
                      </thead>
                    </table>
                  </CardBody>

                </div>
              </div>
            </div>
          )
        }
      </>
    }
  </div>);
}
export default Wallets;
