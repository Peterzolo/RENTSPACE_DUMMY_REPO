import React, { useState } from "react";
import { XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
    Button,
    IconButton,
    Switch,
    Typography,
    Chip,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenConfigurator, } from "@/context";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export function FilterSideNav({ filters, setFilters,onCloseSidebar }) {
    const today = new Date();
    const [controller, dispatch] = useMaterialTailwindController();
    const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
        controller;
    const [selectedItems, setSelectedItems] = useState([]);
    const [filterCount, setFilterCount] = useState(0);

    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [transactionGroup, setTransactionGroup] = useState('');
    const [status, setStatus] = useState('');

    const [showPicker, setShowPicker] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [value, onChange] = useState(new Date());
    const [selectedFilters, setSelectedFilters] = useState([]);
    const handleFilter = () => {
        // Implement filtering logic using minAmount and maxAmount
        console.log('Min Amount:', minAmount);
        console.log('Max Amount:', maxAmount);
    };
    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),

        key: 'selection',
    });
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };
    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        console.log(formatDate(startDate));
        console.log(formatDate(endDate));
        setStartDate(formatDate(startDate));
        setEndDate(formatDate(endDate));
        setSelectionRange(ranges.selection); // Update the selection range state
    };
    // Function to handle selection of an item
    const handleSelectItem = (item) => {
        // Toggle selection
        console.log(selectedItems);
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
            setFilterCount(prevCount => prevCount - 1);
        } else {
            setSelectedItems([...selectedItems, item]);
            setFilterCount(prevCount => prevCount + 1);
        }
    };
    const handleStatusSelect = (item) => {
        console.log(status, item);
        if (status === item) {
            setStatus('');
            // setFilterCount(prevCount => prevCount - 1);
        } else {
            setStatus(item);
            // setFilterCount(prevCount => prevCount + 1);
        }
    };




    const handleTransactionTypeSelect = (item) => {
        setTransactionType(item === transactionType ? '' : item);
    };
    const handleTransactionGroupSelect = (item) => {
        setTransactionGroup(item === transactionGroup ? '' : item);
    };

    const handleCloseSidebar = () => {
        setOpenConfigurator(dispatch, false);
        onCloseSidebar(); // Notify parent component that sidebar is closed
    };
    
    const filterInfo = () => {
        
       
        setSelectedFilters([minAmount, maxAmount, transactionType, transactionGroup, status, startDate, endDate]);
        filters =  {minAmount: minAmount || null,
            maxAmount: maxAmount || null,
            transactionType: transactionType || null,
            transactionGroup: transactionGroup || null,
            status: status || null,
            startDate: startDate || null,
            endDate: endDate || null,};
        // console.log(filters);
        const nonEmptyFilters = Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== null)
        );
        // console.log(nonEmptyFilters)
        const updatedFilters = {
            ...nonEmptyFilters,
          };
        setFilters(updatedFilters);
        setOpenConfigurator(dispatch, false);
        onCloseSidebar();
        //   console.log(updatedFilters);
        // console.log(minAmount, maxAmount, transactionType, transactionGroup, status, startDate, endDate);
    }
    const clearFilter = () => {
        setEndDate('');
        setStartDate("");
        setMinAmount('');
        setMaxAmount('');
        setStatus('');
        setTransactionGroup('');
        setTransactionType('');
    }

    return (
        <aside className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white px-2.5 shadow-lg transition-transform duration-300 ${openConfigurator ? "translate-x-0" : "translate-x-96"
            }`}>
            <div className="flex items-start justify-between px-6 pt-8 pb-6">
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Filter
                      
                    </Typography>

                </div>
                <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={handleCloseSidebar}
                >
                    <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
                </IconButton>
            </div>
            <div className="py-4 px-6">
                <div className="mb-6">
                    <div>
                        <Typography variant="h6" color="black">Date Range:</Typography>
                        <div className="flex flex-row justify-between text-center items-center">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(formatDate(date))}
                                dateFormat="yyyy-MM-dd"
                                maxDate={today}
                                placeholderText="Start date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg inline focus:ring-[#145182] focus:border-[#145182]  w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#145182]  dark:focus:border-[#145182]"
                            />
                            <p className="text-center justify-center align-middle mx-2">to</p>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(formatDate(date))}
                                dateFormat="yyyy-MM-dd"
                                maxDate={today}
                                placeholderText="End date"

                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg inline focus:ring-[#145182] focus:border-[#145182]  w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#145182] dark:focus:border-[#145182]"
                            />


                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <div>
                        <Typography variant="h6" color="black">Amount:</Typography>
                        <div className="flex flex-row flex-wrap justify-between ">


                            <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#145182] focus:border-[#145182]  w-[40%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#145182] dark:focus:border-[#145182] inline"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                placeholder="Min"
                                required />

                            <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#145182] focus:border-[#145182] inline w-[40%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#145182] dark:focus:border-[#145182]"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                placeholder="Max"
                                required />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <div>
                        <Typography variant="h6" color="black">Transaction Type:</Typography>
                        <ul className="flex flex-row flex-wrap">
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${transactionType.includes('credit') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleTransactionTypeSelect('credit')}
                                >
                                    Credit
                                </button>


                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${transactionType.includes('debit') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleTransactionTypeSelect('debit')}
                                >
                                    Debit
                                </button>

                            </li>

                        </ul>
                    </div>
                </div>
                <div className="mb-6">
                    <div>
                        <Typography variant="h6" color="black">Status:</Typography>
                        <ul className="flex flex-row flex-wrap">
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${status.includes('completed' || 'Success' || "successful"||"Completed" ||"success"|| "Successful") ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleStatusSelect('completed' || 'Success' || "successful"||"Completed" ||"success"|| "Successful")}
                                >
                                    Successful
                                </button>


                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${status.includes('pending'||"Pending") ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleStatusSelect('pending'||"Pending")}
                                >
                                    Pending
                                </button>

                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${status.includes('failed'||"Failed") ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleStatusSelect('failed'||"Failed")}
                                >
                                    Failed
                                </button>

                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${status.includes('reversed') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleStatusSelect('reversed' || 'Reversed' ||"reversal" ||"Reversal")}
                                >
                                    Reversed
                                </button>

                            </li>

                        </ul>
                    </div>
                </div>
                <div className="mb-6">
                    <div>
                        <Typography variant="h6" color="black">Service:</Typography>
                        <ul className="flex flex-row flex-wrap">
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${(transactionGroup === 'static-account-transfer') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleTransactionGroupSelect('static-account-transfer')}
                                >
                                    Wallet Funding
                                </button>


                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${(transactionGroup === 'transfer') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleTransactionGroupSelect('transfer')}
                                >
                                    Transfer
                                </button>

                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${transactionGroup.includes('bill') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleTransactionGroupSelect('bill')}
                                >
                                    Bill
                                </button>

                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`text-[#145182] border border-[#145182] font-medium rounded-full text-sm px-5 py-2 text-center me-2 mb-2 focus:outline-none 
    ${transactionGroup.includes('card') ? 'text-white bg-[#145182]' : 'hover:text-white hover:bg-[#145182]'}`}
                                    onClick={() => handleTransactionGroupSelect('card')}
                                >
                                    Card
                                </button>

                            </li>

                        </ul>
                    </div>
                </div>

            </div>
            <div className="flex items-start justify-center px-6 pt-8 pb-6">
                <button
                    onClick={() => clearFilter()}
                    type="button"
                    className={`text-[#145182] border border-[#145182] font-medium rounded-lg text-sm px-8 py-3 text-center me-2 mb-2 focus:outline-none 
    `}

                >
                    Clear All
                </button>
                <button
                    onClick={() => filterInfo()}
                    type="button"
                    className={`text-white border bg-[#145182] font-medium rounded-lg text-sm px-8 py-3 text-center me-2 mb-2 focus:outline-none 
    `}

    
                >
                    Filter
                </button>
            </div>
        </aside>
    )
}


FilterSideNav.displayName = "/src/widgets/layout/filter-sidenav.jsx";

export default FilterSideNav;