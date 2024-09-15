import Fallback from "@/components/FallBack";
import routes from "@/routes";
import { ProfileInfoCard } from "@/widgets/cards";
import { DashboardNavbar, Footer, Sidenav } from "@/widgets/layout";
import { Avatar, Card, CardBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
// import {
//     Sidenav,
//     DashboardNavbar,
//     Configurator,
//     Footer,
// } from "@/widgets/layout";
  
export function UserInfo() {
    const cookies = new Cookies();
    const { userId } = useParams();
    const [data, setData] = useState([]); // Holds the list of tasks
    const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
    const token = cookies.get('token');

    
    useEffect(() => {
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
                `https://rentspacetech.com/api/user/get-user-profile/${userId}`,
        
                // requestOptions
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
              );
              const results = await response.data;
              console.log('results');
              console.log(results);
              setData(results.user);
              setIsLoading(false);
            } catch (error) {
              console.log('Error fetching info:', error.message);
              setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, [])
    if (isLoading) {
        return <Fallback />;
    }
    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav
        routes={routes}
        brandImg= "/img/rentspace.png"
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
        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
        </div>
        <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={data.avatar['url']}
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1 capitalize">
                {data.fullname}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600 uppercase"
                >
                 {data.email}
                </Typography>
              </div>
            </div>
            
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">

            <ProfileInfoCard
              title="Profile Information"
              details={{
                "Account Name": `${data.defaultAccountName}`,
                "Account Number": `${data.defaultAccountNumber}`,
                Mobile:`${data.phoneNumber}`,
                "Referral Code":`${data.referral_code}`,
              }}
            />
          </div>
        </CardBody>
      </Card>
          <Footer />
        </div>
      </div>
        </div>
    );
}

export default UserInfo;
