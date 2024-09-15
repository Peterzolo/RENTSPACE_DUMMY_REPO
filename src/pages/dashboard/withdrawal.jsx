
import Fallback from "@/components/FallBack";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip
} from "@material-tailwind/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { useEffect, useState } from "react";
import axios from 'axios';

export function Withdrawals() {
    const cookies = new Cookies();
    const [data, setData] = useState([]); // Holds the list of tasks
    const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
    const userDataString = localStorage.getItem('user_info');
    const userData = JSON.parse(userDataString);

    const token = cookies.get('token');
    //console.log('token');

    console.log('***')
    const fetchAllWithdrawals = async () => {
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
                'https://rentspacetech.com/api/wallet/withdrawals',

                // requestOptions
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            );
            const results = await response.data;
            console.log('results');
            console.log(results);
            setData(results.wallets);
            //   localStorage.setItem('bvns', JSON.stringify(results.bvns));
            setIsLoading(false);
        } catch (error) {
            console.log('Error fetching withdrawals:', error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllWithdrawals();
    }, []);

    if (isLoading) {
        return <Fallback />;
    }

    return (<div className="mt-12 mb-8 flex flex-col gap-12">
        {userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account' ? <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> :
            <Card>
                <CardHeader color="gray" className="mb-8 p-6 bg-[#145182]">
                    <Typography variant="h6" color="white">
                        Transfer
                    </Typography>
                </CardHeader>
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
                            {data.map(
                                ({ user, description, amount, status, updatedAt, transactionGroup, transactionReference, transactionType, merchantReference, narration, message }, key) => {
                                    const className = `py-3 px-5 ${key === data.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={transactionReference + Math.random()}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                                                    {key + 1}
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
                                                <Chip
                                                    variant="gradient"
                                                    color={transactionGroup.toLowerCase() === "static-account-transfer" ? "yellow" : transactionGroup.toLowerCase() === "transfer" ? "red" : transactionGroup.toLowerCase() === "static-account-transfer" ? "yellow" : transactionGroup.toLowerCase() === "card" ? "blue" : transactionGroup.toLowerCase() === "bill" ? "green" : "blue"}
                                                    value={transactionGroup.toLowerCase() === "static-account-transfer" ? "Virtual Account" : transactionGroup.toLowerCase() === "transfer" ? "Transfer" : transactionGroup.toLowerCase() === "static-account-transfer" ? "Virtual Account" : transactionGroup.toLowerCase() === "card" ? "Card" : transactionGroup.toLowerCase() === "bill" ? "Bill Payment" : "Payment"}
                                                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                />
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
                                                    {moment(updatedAt).format('MMMM Do YYYY, h:mm:ss a')}

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

export default Withdrawals;