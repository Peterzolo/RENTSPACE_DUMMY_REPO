
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
import { FilterSideNav } from "@/widgets/layout";
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

export function SpaceRentInterest() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const { spacerentId } = useParams();
    const cookies = new Cookies();
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userDataString = localStorage.getItem('user_info');
    const userData = JSON.parse(userDataString);






    const token = cookies.get('token');

    const handleGoBack = () => {
        navigate(-1); // Go back one step in history
    };


    useEffect(() => {
        const fetchSpaceRentInterest = async () => {
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
                    `https://rentspacetech.com/api/rent/get-rentInterestHistories/${spacerentId}`,

                    // requestOptions
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


        fetchSpaceRentInterest();
    }, [spacerentId]);



    const handleSidebarClose = () => {
        setIsSidebarOpen(prevIsSidebarOpen => {
            console.log('prevIsSidebarOpen:', prevIsSidebarOpen);
            if (!prevIsSidebarOpen) {
                console.log('Sidebar is closed');
                console.log('Filters:', filters);
            }
            return false; // Close the sidebar
        });
    };


    if (isLoading) {
        return <Fallback />;
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            {userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account'
                ?
                <div className="flex items-center justify-normal mx-auto h-[50vh]">
                    Oops!!! You do not have permission to view this Page.
                </div>
                :
                <>
                <FilterSideNav filters={filters} setFilters={setFilters} onCloseSidebar={handleSidebarClose} />
                <Card>
               
                <div className="flex items-center justify-start mx-6 align-middle cursor-pointer" onClick={handleGoBack}>
                    <ArrowLeftIcon className="h-5 w-5 text-[#145182] mx-2 font-bold text-lg" />
                    <p className="text-md fotn-bold text-[#145182]">Back To Space Rents</p>
                </div>
                {/* <CardHeader color="gray" className="my-8 p-6 bg-[#145182]">
                    <Typography variant="h6" color="white">
                        <Avatar src={historyData.user?.avatar['url']} alt={historyData.user?.firstName} size="sm" variant="rounded" />
                        &nbsp; Transactions Made By {historyData.user.firstName} {historyData.user.lastName}

                    </Typography>

                </CardHeader> */}
                <div className="grid lg:grid-cols-3 md:grid-cols-2  gap-4 mx-6">
                    <div className="border rounded-md p-10 ">
                        <div className="flex justify-center items-center flex-col">
                            <div ><p className="text-base font-medium uppercase">Total Transactions</p></div>
                            <div><p className="text-lg font-bold mt-5 text-[#145182]"> {historyData?.rangeInterest[0]?.totalAmount.toFixed(2)} </p></div>
                        </div>
                    </div>
                    {/* <div className="border rounded-md p-10 ">

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
                    </div> */}





                </div>




                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 mx-6">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Index", "Amount", "Date"].map(
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
                            {historyData.rentInterestHistories.map(
                                ({  interestAmount,spaceRent,updatedAt }, index) => {
                                    const key = spaceRent;
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
                                                    className="text-xs font-medium text-blue-gray-600"
                                                >
                                                    {interestAmount}
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
            </Card>
                </>
             
            }
        </div>
    );
}


export default SpaceRentInterest;