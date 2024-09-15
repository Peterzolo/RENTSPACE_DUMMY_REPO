import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import Cookies from 'universal-cookie';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Fallback from "@/components/FallBack";
import { useNavigate } from 'react-router-dom';
// import { localBaseUrl } from "@/utils/api";
import { formatNaira } from "@/utils/currencyFormatter";

export function SpaceDeposit() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [data, setData] = useState([]); // Holds the list of tasks
    const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
    const userDataString = localStorage.getItem('user_info');

    const userData = userDataString ? JSON.parse(userDataString) : null;



  

    const token = cookies.get('token');

    const fetchAllDeposits = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);
     
        try {
            const response = await axios.get(
                'https://rentspacetech.com/api/all-space-deposits',

                // `${localBaseUrl}/all-space-deposits`,
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
            );
            const results = await response.data.deposits;
            setData(results);
       
            setIsLoading(false);
        } catch (error) {
    
            setIsLoading(false);
        }
    };
    
    const downloadCSV = () => {

        const csvHeader = "Index,User,Deposit Name,Type,Deposit ID,Current Balance,Total Balance,Saving Duration,Amount,Start Date,Maturity Date,Deposit Interest,Status";
        

        const csvRows = data.map(({ user, name, type, deposit_id, fixedDepositAmount, currentBalance, totalBalance, savingDuration, startDate, maturityDate, status }, index) => {
            const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
            return [
                index + 1,
                `"${fullName}"`, 
                `"${name}"`,
                `"${type}"`,
                `"${deposit_id}"`,
                `"${formatNaira(fixedDepositAmount)}"`,
                `"${formatNaira(currentBalance)}"`,
                `"${formatNaira(totalBalance)}"`,
                `"${savingDuration} days"`,
                `"${startDate}"`,
                `"${maturityDate}"`,
                `"${formatNaira(totalBalance - fixedDepositAmount)}"`, 
                `"${status}"`
            ].join(",");
        });
    
        const csvContent = [csvHeader, ...csvRows].join("\n");
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'SpaceRent.csv');
    };
    

    // TODO- To be used for dynamic navigation
    // const handleViewInterest = (deposit_id) => {
    //     navigate(`/spacerent/interests/${deposit_id}`);
    //   };

    useEffect(() => {
        fetchAllDeposits();
    }, []);


    if (isLoading) {
        return <Fallback />;
    }


    return (
    
    <div className="mt-12 mb-8 flex flex-col gap-12">

        { userData.role !== 'super-admin' && userData.role !== 'admin' && userData.role !== 'account' ? 
              <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> :


           <Card>
                   <CardHeader color="gray" className="mb-8 p-6 bg-[#145182]  mt-[20px]">
                        <Typography variant="h6" color="white">
                            Space Deposit
                        </Typography>
                     </CardHeader>

                <div className='flex justify-between md:flex-row my-4 px-6 flex-col md:gap-0 gap-4'>
                    <button type="button" className="text-white bg-[#145182] hover:bg-[#145182] focus:outline-none  font-medium rounded-full text-sm px-16 py-3.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-[#145182] dark:focus:ring-[#145182]" onClick={downloadCSV}>Export Data</button>
                 </div>
                    <CardBody className="overflow-x-auto px-6 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["Index", "User", 'Deposit Name', "Type",  "Deposit ID", "Amount", "Current Balance","Total Balance",  "Saving Duration", "Start Date", "Maturity Date", "Deposit Interest", "Status"].map(
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
                                            ({ _id, name, type, deposit_id,fixedDepositAmount, currentBalance,savingDuration, startDate, maturityDate, expectedInterest, totalBalance, user, status }, key) => {          
                                                const fullName = `${user?.firstName} ${user?.lastName}`;const className = `py-3 px-3 ${key === data.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50"
                                            }`;

                                            
                                            const getStatusStyle = (status) => {
                                                switch (status) {
                                                    case "Active":
                                                        return "bg-blue-500 text-white rounded-full px-3 py-1 text-[12px]";
                                                    case "Completed":
                                                        return "bg-green-500 text-white rounded-full px-3 py-1 text-[12px]";
                                                    case "Broken":
                                                        return "bg-red-500 text-white rounded-full px-3 py-1 text-[12px]";
                                                    case "Scheduled":
                                                        return "bg-yellow-500 text-white rounded-full px-3 py-1 text-[12px]";
                                                    case "Disbursed":
                                                        return "bg-purple-500 text-white rounded-full px-3 py-1 text-[12px]";
                                                    default:
                                                        return "bg-gray-500 text-white rounded-full px-3 py-1 text-[12px]";
                                                }
                                            };
                                            
                                        return (
                                            <tr key={_id} className="cursor-pointer">
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {key + 1}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {fullName}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {name}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {type}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {deposit_id}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {formatNaira(fixedDepositAmount)}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    
                                                    {formatNaira(currentBalance)}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    
                                                    {formatNaira(totalBalance)}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {savingDuration} days
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {startDate}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {maturityDate}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-medium text-blue-gray-600">
                                                    {formatNaira(expectedInterest)}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                            <span className={getStatusStyle(status)}>
                                                                {status}
                                                            </span>
                                            </td>
                                        
                                        </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </CardBody>
            </Card>}
    </div>
    
    
    );
}

export default SpaceDeposit;