import Fallback from "@/components/FallBack";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";
import { AuthContext } from "@/context/AuthProvider";
// import { localBaseUrl } from "@/utils/api";





export function SignIn() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState(
    {
      email: '',
      password: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const rolePasscodeMap = {
    superAdmin: '926135487',
    admin: '502783619',
    account: '374916528',
    tester: '815903746',
    sales: '269354187',
    marketing: '693210875',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var requestOptions = {
      email: formData.email,
      password: formData.password,
      fcm_token: 'fdghjgfdsaghhfdsaertyuretytuytr',
      // fcm_token: '',
      deviceType: "Android",
      deviceName: "Sams"
    }


    try {
      const data = await axios.post(
        'https://rentspacetech.com/api/user/login',
        // `${localBaseUrl }/user/login`,

        requestOptions,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(data);
      const result = await data.data;
      const token = result.token;
      login(token);
      // cookies.set("token", token);
      console.log(result);
      if (result.error) {
        console.log(result);
        toast.error(result.error);
        setFormData({
          email: '',
          password: ''
        });
        setIsLoading(false);
        return;
      }
      else {
        setIsLoading(false);
        toast.success('Successfully logged in');
        const timeout = setTimeout(
          () =>
            navigate(
              '/home'),
          3000
        );
        return () => clearTimeout(timeout);
      }
    } catch (error) {

      console.log("ERROR", error)

      setIsLoading(false);
      // toast.error(error.response.data.errors[0].error);
      // console.log('Error', error.response.data.errors[0].error);
    }
  }
  if (isLoading) {
    return <Fallback />;
  }
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 my-auto">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              value={formData.email}
              onChange={handleChange}
              name="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              value={formData.password || ''}
              name="password"
              onChange={handleChange}
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <button type="submit" className="text-white bg-[#145182]  focus:outline-none w-full  font-medium rounded-md text-sm px-16 py-3.5 text-center me-2 mt-6 ">Sign In</button>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;

// dashboard-rentspace-ten.vercel.app