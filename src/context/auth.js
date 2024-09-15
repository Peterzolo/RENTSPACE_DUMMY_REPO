// auth.js
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

export const checkAuthentication = () => {
    const cookies = new Cookies();
    const token = cookies.get('token'); // Assuming you stored the token in local storage
  
    if (!token) {
      // No token found, user is not authenticated
      return false;
    }
  
    // Decode the token to extract expiration date and other properties if needed
    // You can use jwt-decode library or any other method to decode the token
    // For simplicity, let's assume the token is a JWT
    const decodedToken = jwtDecode(token);
  
    // Check if the token is expired
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
  if (decodedToken.exp && decodedToken.exp < currentTime) {
    console.log("expired");
    cookies.remove('token');
      // Token is expired, user is not authenticated
      return false;
    }
  
    // Token is valid, user is authenticated
    return true;
  };
  
  // Function to decode JWT token (you can use jwt-decode library)
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decoding JWT payload
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  };
  