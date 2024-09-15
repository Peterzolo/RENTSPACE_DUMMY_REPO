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


export function WalletFilter({ filters, setFilters,onCloseSidebar }) {
    const today = new Date();
    const [controller, dispatch] = useMaterialTailwindController();
    const { openConfigurator } =
        controller;

    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);
  

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




    const handleCloseSidebar = () => {
        setOpenConfigurator(dispatch, false);
        onCloseSidebar(); // Notify parent component that sidebar is closed
    };
    
    const filterInfo = () => {
        
       
        setSelectedFilters([minAmount, maxAmount, startDate, endDate]);
        filters =  {minAmount: minAmount || null,
            maxAmount: maxAmount || null,
           
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
    }
    const clearFilter = () => {
        setEndDate('');
        setStartDate("");
        setMinAmount('');
        setMaxAmount('');
      
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


WalletFilter.displayName = "/src/widgets/layout/wallet-filter.jsx";

export default WalletFilter;