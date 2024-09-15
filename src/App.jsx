import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn } from "./pages/auth";
import { Profile } from "./pages/dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Cookies from 'universal-cookie';
import PrivateRoutes from "./components/PrivateRoute";
import Fallback from "@/components/FallBack";
import { useState,useEffect } from "react";
import axios from 'axios';
import UserTransaction from "./pages/dashboard/user_transactions";
import UserInfo from "./pages/dashboard/user-info";
import { SpaceRentInterest } from "./pages/dashboard/space_rent_interest";
// import { localBaseUrl } from "./utils/api";

function App() {
  const cookies = new Cookies();
  const [data, setData] = useState([]); // Holds the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded

  const token = cookies.get('token');
  const fetchAdminHistories = async () => {
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
        'https://rentspacetech.com/api/user/adminHistory',
        // `${localBaseUrl}/user/adminHistory`,
       
  
        { headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`} }
      );
      const results = await response.data;

      // if (results.error.contains("You do not have permision to perform this action.")) {
      //   console.log(results);
      //   toast.error(results.error);
      //   setIsLoading(false);
      //   return;
      // }
      localStorage.removeItem('histories_permission_error')
      setData(results.history);
      localStorage.setItem('all_histories', JSON.stringify(results.history));
      setIsLoading(false);
    } catch (error) {

      if (error.response.data.error == "You do not have permision to perform this action.") {
        console.log(error.response.data.error);
        localStorage.setItem('histories_permission_error', JSON.stringify(error.response.data.error));
        // toast.error(error.response.data.error);
        setIsLoading(false);
        return;
      }
      // if(error.response.)
      console.log('Error fetching histories info:', error.message);
      setIsLoading(false);
    }
  };

  // const fetchAllUsers = async () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   myHeaders.append('Authorization', `Bearer ${token}`);
  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   };
  //   try {
  //     const response = await axios.get(
  //       'https://rentspacetech.com/api/user/get-users',
       
  //       // requestOptions
  //       { headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`} }
  //     );
  //     const results = await response.data;
  //     console.log(results);
  //     setData(results.users);
  //     localStorage.setItem('all_users', JSON.stringify(results.users));
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log('Error fetching info:', error.message);
  //     setIsLoading(false);
  //   }
  // };
  const fetchUserInfo = async () => {
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
        'https://rentspacetech.com/api/user/get-user',
            //  `${localBaseUrl}/user/get-user`,
       
        // requestOptions
        { headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`} }
      );
      const results = await response.data;
      console.log('results');
      console.log(results);
      setData(results.userDetails);
      localStorage.setItem('user_info', JSON.stringify(results.userDetails));
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching info:', error.message);
      setIsLoading(false);
    }
  };

  // const fetchRentTotal = async () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   myHeaders.append('Authorization', `Bearer ${token}`);
  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   };
  //   try {
  //     const response = await axios.get(
  //       'https://rentspacetech.com/api/rent/get-rentTotal',
       
  //       // requestOptions
  //       { headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`} }
  //     );
  //     const results = await response.data;
  //     console.log('results');
  //     console.log(results);
  //     setData(results.total_payment);
  //     localStorage.setItem('rent_total', JSON.stringify(results.total_payment));
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log('Error fetching rent payment:', error.message);  
  //     setIsLoading(false);
  //   }
  // };


  useEffect(() => {
    fetchUserInfo();
    // fetchAllUsers();
    fetchAdminHistories();
    // fetchRentTotal();
  }, []);

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <>
      <ToastContainer />
      <Routes>
      <Route path="/auth/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/wallet/user-transactions/:userId" element={<UserTransaction />} />
          <Route path="/spacerent/interests/:spacerentId" element={<SpaceRentInterest />} />
          <Route path="/customers/:firstName/:userId/*" element={<UserInfo />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
