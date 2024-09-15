
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
import 'react-date-range/dist/styles.css'; // main css file of react-date-range
import 'react-date-range/dist/theme/default.css';
import { Configurator, FilterSideNav } from "@/widgets/layout";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
// import { localBaseUrl } from "@/utils/api";


export function Transactions() {
    const cookies = new Cookies();
    const [filters, setFilters] = useState({});
    const [controller, dispatch] = useMaterialTailwindController();
    const [data, setData] = useState([]); // Holds the list of tasks
    const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
    const userDataString = localStorage.getItem('user_info');
    const userData = JSON.parse(userDataString);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const getLastMonthStartDate = () => {
        const today = new Date();
        const aprilStartDate = new Date(today.getFullYear(), 3, 1); // April is month index 3
        return aprilStartDate;
    };
    const [value, setValue] = useState({
        startDate: getLastMonthStartDate(),
        endDate: Date.now
    });

    const token = cookies.get('token');

    const fetchAllTransactions = async (filters) => {
        setIsLoading(true);
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);

        // Construct query parameters for filtering
        const queryParams = new URLSearchParams(filters).toString();
    
   
        let url = 'https://rentspacetech.com/api/wallet/transactions';
    //   let url =  `${localBaseUrl}/wallet/transactions`
    
        if (filters) {
            // Construct query parameters for filtering
            const queryParams = new URLSearchParams(filters).toString();
            url += `?${queryParams}`;
        }

        try {
            const response = await axios.get(
                url
                ,
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            );
            const results = response.data;
            console.log('results:', results);
            console.log(data.totalCreditTransactions);
            setData(results);
            setIsLoading(false);
        } catch (error) {
            console.log('Error fetching Transactions:', error.message);
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://rentspacetech.com/api/wallet/transactions?search=${searchQuery}`,

                // `${stagingBaseUrl}/wallet/transactions?search=${searchQuery}`,
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            );
            console.log(response);
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log('Error searching Transactions:', error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTransactions();
    }, []);


    const downloadCSV = () => {
        const csvContent = [
            "Index,User,Description,Service,Status,Amount,Date",
            ...data?.walletHistories.map(({ user, description, message, narration, amount, status, updatedAt, transactionGroup }, index) => (
                `${index + 1},"${user?.lastName || ""} ${user?.firstName || "Deleted User"}","${description || message || narration}","${transactionGroup}","${status}","${amount.toFixed(2)}","${moment(updatedAt).format('DD/MM/YYYY')}"`
            ))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'transactions.csv');
    };


    const handleSidebarClose = () => {
        setIsSidebarOpen(prevIsSidebarOpen => {
            if (!prevIsSidebarOpen) {
            }
            return false; // Close the sidebar
        });
    };
    useEffect(() => {
        if (Object.keys(filters).length > 0) {

   
            fetchAllTransactions(filters);
            // Assuming fetchAllTransactions is imported or defined elsewhere
        }
        else {

            fetchAllTransactions();
        }
    }, [filters]);

console.log(data)
    const handleCancelFilter = (keyToRemove) => {
        // Remove the filter with the specified key
        const updatedFilters = { ...filters };
        delete updatedFilters[keyToRemove];

  

        // Update the filters state
        setFilters(updatedFilters);
    };


    if (isLoading) {
        return <Fallback />;
    }

    return (<div className="mt-12 mb-8 flex flex-col gap-12">
        {userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account' ? <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> :

            <Card>

                <FilterSideNav filters={filters} setFilters={setFilters} onCloseSidebar={handleSidebarClose} />
                <IconButton
                    size="lg"
                    // color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray bg-[#145182]"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <AdjustmentsVerticalIcon className="h-5 w-5" />
                </IconButton>
                <CardHeader color="gray" className="my-8 p-6 bg-[#145182]">
                    <Typography variant="h6" color="white">
                        Transactions
                    </Typography>
                </CardHeader>
                <div className="grid lg:grid-cols-3 md:grid-cols-2  gap-4 mx-6">
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]"> {data.totalTransactions} </p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">

                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Credit Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{data.totalCreditTransactions}</p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Debit Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{data.totalDebitTransactions}</p></div>
                        </div>
                    </div>


                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Inflow</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{Intl.NumberFormat('en-DE', {
                                style: 'currency',
                                currency: 'NGN',
                                useGrouping: true,
                            }).format(data.totalInflow)}</p></div>
                        </div>
                    </div>
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Outflow</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]">{Intl.NumberFormat('en-DE', {
                                style: 'currency',
                                currency: 'NGN',
                                useGrouping: true,
                            }).format(data.totalOutflow)}</p></div>
                        </div>
                    </div>
                
                </div>

                <div className='flex justify-between flex-row my-4 px-6'>

                    <form className="flex items-start max-w-lg">
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
                    </form>

                    <button type="button" className="text-white bg-[#145182] hover:bg-[#145182] focus:outline-none  font-medium rounded-full text-sm px-16 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-[#145182] dark:focus:ring-[#145182]" onClick={downloadCSV}>Export Data</button>
                </div>


                {
                    Object.keys(filters).length > 0 && <section className="py-10 relative">
                        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">

                                <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-start w-full flex-wrap">
                                    {Object.keys(filters).length > 0 && (
                                        <>
                                            {Object.keys(filters).map(key => {
                                                let value = filters[key];
                                                if (key === 'transactionGroup' && value === 'static-account-transfer') {
                                                    value = 'Wallet Funding';
                                                }
                                                if (['startDate', 'endDate'].includes(key)) {

                                                    value = moment(value).format('MMMM Do YYYY'); // Assuming you have a formatDate function
                                                }
                                                return (
                                                    <span key={key} id="badge-dismiss-default" className="inline-flex items-center px-4 py-2.5 me-2 text-sm font-medium text-white bg-[#145182] rounded-full">
                                                        {value}
                                                        <button type="button" className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-full" onClick={() => handleCancelFilter(key)} data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                                            <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                            </svg>
                                                            <span className="sr-only">Remove badge</span>
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                }
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Index", "User", "Description", "Service", "Status", "Amount", "Date"].map(
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
                            {data && data.walletHistories.map(
                                ({ user, description, amount, status, updatedAt, transactionGroup, transactionReference, transactionType, merchantReference, narration, message }, index) => {
                                    const key = (transactionReference && merchantReference) ? `${transactionReference}-${merchantReference}-${index}` : index;
                                    const className = `py-3 px-5 ${key === data.walletHistories.length - 1
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
                                            <td className={className}>
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
                                            </td>


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
                                                        color={transactionGroup.toLowerCase() === "static-account-transfer" ? "yellow" : transactionGroup.toLowerCase() === "transfer" ? "red" : transactionGroup.toLowerCase() === "static-account-transfer" ? "yellow" : transactionGroup.toLowerCase() === "card" ? "blue" : transactionGroup.toLowerCase() === "bill" ? "green" : "purple"}
                                                        value={transactionGroup.toLowerCase() === "static-account-transfer" ? "Virtual Account" : transactionGroup.toLowerCase() === "transfer" ? "Transfer" : transactionGroup.toLowerCase() === "static-account-transfer" ? "Virtual Account" : transactionGroup.toLowerCase() === "card" ? "Card" : transactionGroup.toLowerCase() === "bill" ? "Bill Payment" : "Inflow"}
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
                                                    {moment(updatedAt).format('DD/MM/YYYY')}

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

export default Transactions;