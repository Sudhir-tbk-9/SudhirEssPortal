import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import { baseUrl } from '../../Global/Config';

class LoginServices {
  async LoginApi(post: any) {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/auth/login`, post, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        await AsyncStorage.setItem('accessToken', accessToken);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Error during login:', error); 
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    }
  }
  
}

export const loginservice = new LoginServices();
