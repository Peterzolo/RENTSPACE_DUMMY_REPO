import { Routes, Route } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import Cookies from 'universal-cookie';
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import Fallback from "@/components/FallBack";
import { useState, useEffect, Fragment } from "react";
import axios from 'axios';
// import { localBaseUrl } from "@/utils/api";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
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
        

        // requestOptions
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      const results = await response.data;
      console.log(results);
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
        // `${localBaseUrl}/user/get-user`,

        // requestOptions
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
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
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/rentspace.png" : "/img/rentspace.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Routes>
          {routes.map(({ layout, pages }) => {
            if (layout === "dashboard") {
              return pages.map(({ path, element, dropdown }) => (
                <Fragment key={path}>
                  <Route exact path={path} element={element} />
                  {dropdown && dropdown.map(({ path: dropdownPath, element: dropdownElement }) => (
                    <Route key={dropdownPath} exact path={dropdownPath} element={dropdownElement} />
                  ))}
                </Fragment>
              ));
            }
            return null;
          })}
        </Routes>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
