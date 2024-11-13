import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import { baseUrl } from '../../Global/Config';

class PunchServices {
  async PunchInApi(location: any) {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        `${baseUrl}/api/v1/punch/in`, 
        location,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
     
        return response.data;
      } else {

        
        throw new Error(response.data.message || 'Punch In failed');
      }
    } catch (error) {
      
      console.error('Error during Punch In:', error);
      throw error;
    }
  }

  async PunchOutApi(location:any) {
    try {
      // console.log(location);
      
      const token = await AsyncStorage.getItem('accessToken');
      // console.log(token);
      const response = await axios.patch(
        `${baseUrl}/api/v1/punch/out`, 
        location, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
      
      if (response.status === 200) {
       
        
        return response.data;
      } else {
        
        throw new Error(response.data.message || 'Punch Out failed');
      }
    } catch (error) {
      console.log(error);
      
      console.error('Error during Punch Out:', error);
      throw error;
    }
  }
}

export const punchService = new PunchServices();
