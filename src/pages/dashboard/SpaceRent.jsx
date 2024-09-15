import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Progress,
} from "@material-tailwind/react";
import moment from 'moment';
import Cookies from 'universal-cookie';
import { useEffect, useState } from "react";
import axios from 'axios';
import Fallback from "@/components/FallBack";
import { useNavigate } from 'react-router-dom';
// import { localBaseUrl } from "@/utils/api";

export function SpaceRent() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [data, setData] = useState([]); // Holds the list of tasks
    const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
    const userDataString = localStorage.getItem('user_info');
    const userData = JSON.parse(userDataString);

    const token = cookies.get('token');

  
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
            console.log('results');
            console.log(results);
            setData(results.rents);
            setIsLoading(false);
        } catch (error) {
            console.log('Error fetching rents:', error.message);
            setIsLoading(false);
        }
    };

    const downloadCSV = () => {
        const csvContent = [
            "Index,User,Rent Name,Paid Amount,Amount,Interval,Interval Amount, Completed, Payment Status, Current Payment, Payment Count,Start Date, Next Payment Date, Due Date, Creation Date, Updated On",
            ...data.map(({ rentName, paid_amount, amount, interval, interval_amount, completed, payment_status, current_payment, payment_count, next_date, due_date, createdAt, updatedAt, userFullName,date }, index) => (
                `${index + 1},"${userFullName}","${rentName}","${paid_amount}", "${amount}", "${interval}", "${interval_amount}", "${completed}", "${payment_status}", "${current_payment}", "${payment_count}", "${date}","${next_date}", "${due_date}", "${moment(createdAt).format('DD/MM/YYYY')}", "${moment(updatedAt).format('DD/MM/YYYY')}"`
            ))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Space Rent.csv');
    };

    const handleViewInterest = (spacerentId) => {
        navigate(`/spacerent/interests/${spacerentId}`);
      };

    useEffect(() => {
        fetchAllRents();
    }, []);
    if (isLoading) {
        return <Fallback />;
    }
    return (<div className="mt-12 mb-8 flex flex-col gap-12">
        {userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account' ? <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> :
            <Card>
                <CardHeader color="gray" className="mb-8 p-6 bg-[#145182]">
                    <Typography variant="h6" color="white">
                        Space Rents
                    </Typography>
                </CardHeader>
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
                <CardBody className="overflow-x-auto px-6 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Index", "User", 'Rent Name', "Completion", "Target", "Interval", "Interval Amount", "Paid Amount", "Completed", "Status", "No Of Payments made", "Total No of Payments","Start Date", "Next Payment Date", "Due Date", "Created On", "Updated On"].map(
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
                            {data.map(
                                ({ _id,rentName, paid_amount, amount, rentspace_id, interval, interval_amount, completed, payment_status, current_payment, payment_count,date, next_date, due_date, createdAt, updatedAt, userFullName }, key) => {
                                    const className = `py-3 px-3 ${key === data.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={rentspace_id} className="cursor-pointer" onClick={() => handleViewInterest(_id)}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                                                    {key + 1}
                                                </Typography>

                                            </td>
                                            <td className={className}>
                                                <div className="flex items-center gap-4 w-36">
                                                    <div>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-semibold capitalize"
                                                        >
                                                            {userFullName}
                                                        </Typography>

                                                    </div>
                                                </div>
                                            </td>

                                            <td className={className}>
                                                <div className="flex items-center gap-4 w-36">
                                                    {/* <Avatar src={img} alt={name} size="sm" /> */}
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                    >
                                                        {rentName}
                                                    </Typography>
                                                </div>
                                            </td>
                                         
                                            <td className={className}>
                                                <div className="w-10/12">
                                                    <Typography
                                                        variant="small"
                                                        className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {((parseFloat((paid_amount / amount)) * 100)).toFixed(2)}%
                                                    </Typography>
                                                    <Progress
                                                        value={parseFloat((paid_amount / amount) * 100).toFixed(2)}
                                                        variant="gradient"
                                                        color={(parseFloat((paid_amount / amount) * 100).toFixed(2) === 100) ? "green" : "gray"}
                                                        className="h-1"
                                                    />
                                                </div>

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
                                              
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {interval}
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
                                                    }).format(interval_amount)}
                                               
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">

                                                    <Typography
                                                        variant="small"
                                                        className="text-xs font-medium text-blue-gray-600"
                                                    >
                                                        {Intl.NumberFormat('en-DE', {
                                                            style: 'currency',
                                                            currency: 'NGN',
                                                            useGrouping: true,
                                                        }).format(paid_amount)}
                                                      
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {completed.toString()}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Chip
                                                    variant="gradient"
                                                    color={payment_status.toLowerCase() == 'active' ? "green" : "blue-gray"}
                                                    value={payment_status.toLowerCase() == 'active' ? "active" : "Inactive"}
                                                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                />
                                            </td>
                                         
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {current_payment}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {payment_count}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {next_date}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {due_date}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {moment(createdAt).format('DD/MM/YYYY')}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
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

export default SpaceRent;