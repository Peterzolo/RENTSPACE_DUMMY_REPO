
import Fallback from "@/components/FallBack";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    IconButton
} from "@material-tailwind/react";
import Cookies from 'universal-cookie';
import moment from 'moment';
import { useEffect, useState } from "react";
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Configurator, FilterSideNav } from "@/widgets/layout";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

export function UserTransaction() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const cookies = new Cookies();
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userDataString = localStorage.getItem('user_info');
    const userData = JSON.parse(userDataString);

    const token = cookies.get('token');

    const handleGoBack = () => {
        navigate(-1); 
    };

    useEffect(() => {
        const fetchUserHistories = async () => {
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
                    `https://rentspacetech.com/api/wallet/user-transactions?userId=${userId}`,

                    
                    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
                );
                const results = await response.data;
                console.log(results);
                setHistoryData(results);
                setIsLoading(false);
            } catch (error) {
                console.log('Error fetching wallets info:', error.message);
                setIsLoading(false);
            }
        };


        fetchUserHistories();
    }, [userId]);

    const downloadCSV = () => {
        const csvContent = [
            "Index,User,Description,Service,Status,Amount, Transaction Reference,Transaction Type, Date",
            ...historyData.walletHistories.map(({  description, amount, status, updatedAt, narration, message, transactionGroup, transactionReference, transactionType }, index) => (
                `${index + 1},"${historyData.user.firstName + " " + historyData.user.lastName}","${description || message || narration}","${transactionGroup}","${status}","${amount.toFixed(2)}","${transactionReference}","${transactionType}","${moment(updatedAt).format('DD/MM/YYYY')}"`
            ))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `${historyData.user.firstName} ${historyData.user.lastName}.csv`);
    };

    if (isLoading) {
        return <Fallback />;
    }
    return (<div className="mt-12 mb-8 flex flex-col gap-12">
        {userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account' ? <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> :
            <Card>
                <div className="flex items-center justify-start mx-6 align-middle cursor-pointer" onClick={handleGoBack}>
                    <ArrowLeftIcon className="h-5 w-5 text-[#145182] mx-2 font-bold text-lg" />
                    <p className="text-md fotn-bold text-[#145182]">Back To Wallets</p>
                </div>
                <CardHeader color="gray" className="my-8 p-6 bg-[#145182]">
                    <Typography variant="h6" color="white">
                        <Avatar src={historyData.user?.avatar['url']} alt={historyData.user?.firstName} size="sm" variant="rounded" />
                        &nbsp; Transactions Made By {historyData.user.firstName} {historyData.user.lastName}

                    </Typography>

                </CardHeader>
                <div className="grid lg:grid-cols-3 md:grid-cols-2  gap-4 mx-6">
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]"> {historyData.totalTransactions} </p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">

                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Credit Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{historyData.totalCreditTransactions}</p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Debit Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{historyData.totalDebitTransactions}</p></div>
                        </div>
                    </div>

                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Inflow</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{Intl.NumberFormat('en-DE', {
                                style: 'currency',
                                currency: 'NGN',
                                useGrouping: true,
                            }).format(historyData.totalInflow)}</p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Outflow</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{Intl.NumberFormat('en-DE', {
                                style: 'currency',
                                currency: 'NGN',
                                useGrouping: true,
                            }).format(historyData.totalOutflow)}</p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Main Balance</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{Intl.NumberFormat('en-DE', {
                                style: 'currency',
                                currency: 'NGN',
                                useGrouping: true,
                            }).format(historyData.user.wallet.mainBalance)}</p></div>
                        </div>
                    </div>





                </div>




                <div className='flex justify-between md:flex-row my-4 px-6 flex-col md:gap-0 gap-4'>
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
                  id="default-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#145182] focus:border-[#145182] block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#145182] dark:focus:border-[#145182]" placeholder="Search Customers..." required />
              </div>
              <button onClick={handleSearch} className="inline-flex items-center py-2.5 px-6 ms-2 text-sm font-medium text-white bg-[#145182] rounded-lg border border-[#145182] hover:bg-blue-800   dark:hover:bg-[#145182]">
                Search
              </button>
            </form> */}

                    <button type="button" className="text-white bg-[#145182] hover:bg-[#145182] focus:outline-none  font-medium rounded-full text-sm px-16 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-[#145182] dark:focus:ring-[#145182]" onClick={downloadCSV}>Export Data</button>
                </div>

                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 mx-6">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Index", "Description", "Service", "Status", "Amount", "Date"].map(
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
                            {historyData.walletHistories.map(
                                ({ user, description, amount, status, updatedAt, narration, message, transactionGroup, transactionReference, transactionType, merchantReference }, index) => {
                                    const key = (transactionReference && merchantReference) ? `${transactionReference}-${merchantReference}-${index}` : index;
                                    const className = `py-3 px-5 ${key === historyData.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={key}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                                                    {index + 1}
                                                </Typography>

                                            </td>
                                            {/* <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={user?.avatar['url']} alt={user?.firstName} size="sm" variant="rounded" />
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold capitalize"
                                                    >
                                                        {user?.lastName || ""} {user?.firstName || "Deleted User"}
                                                    </Typography>

                                                </div>
                                            </div>
                                        </td> */}


                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-sm font-bold text-dark"
                                                >
                                                    {description || narration || message}
                                                </Typography>
                                            </td>


                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-sm font-medium text-dark"
                                                >
                                                    <Chip
                                                        variant="gradient"
                                                        color={transactionGroup == "Virtual Account Funding" ? "yellow" : transactionGroup.toLowerCase() === "transfer" ? "red" : transactionGroup.toLowerCase() == "Virtual Account Funding".toLowerCase() ? "yellow" : transactionGroup.toLowerCase() === "card" ? "blue" : transactionGroup.toLowerCase() === "bill" ? "green" : "blue"}
                                                        value={transactionGroup.toLowerCase() == "Virtual Account Funding".toLowerCase() ? "Virtual Account" : transactionGroup.toLowerCase() === "transfer" ? "Transfer" : transactionGroup.toLowerCase() === "Virtual Account Funding".toLowerCase() ? "Virtual Account" : transactionGroup.toLowerCase() === "card" ? "Card" : transactionGroup.toLowerCase() === "bill" ? "Bill Payment" : "Payment"}
                                                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                    />
                                                </Typography>
                                            </td>
                                            <td className={className}>

                                                <Typography
                                                    variant="small"
                                                    className="text-sm font-medium "
                                                    color={status.toLowerCase() === "pending" ? "yellow" : status.toLowerCase() === "failed" ? "red" : status.toLowerCase() === "submitted" ? "yellow" : status.toLowerCase() === "cancelled" ? "red" : status.toLowerCase() === 'completed' || 'Success' || "successful" || "Completed" || "success" || "Successful" ? "green" : "yellow"}
                                                >

                                                    {status.toLowerCase() === "pending" ? "Pending" : status.toLowerCase() === "failed" ? "Failed" : status.toLowerCase() === "submitted" ? "Submitted" : status.toLowerCase() === "cancelled" ? "Cancelled" : status.toLowerCase() === 'completed' || 'Success' || "successful" || "Completed" || "success" || "Successful" ? "Completed" : "Pending"}
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
                                                    }).format(amount)}
                                                    {/* &#8358; {amount.toFixed(2)} */}
                                                </Typography>
                                            </td>

                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {moment(updatedAt).format('DD/MM/YYYY -- h:mm:ss a')}

                                                </Typography>
                                            </td>

                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>}
    </div>);
}

export default UserTransaction;