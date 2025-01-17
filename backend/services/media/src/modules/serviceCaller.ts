import axios from 'axios';
import config from "../../config/config"

export default class ServiceCaller {
    async getItem(token: string): Promise<{ data?: any }> {
        try {
            const response = await axios.get(`${config.service.usermanagement}/user/profile`, { 
                headers: { authorization: token }
            });

            if (response.status === 200 && response.data['Data'].success) {
                return { data: response.data['Data'].data };
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }
    
    async setItem(token: string): Promise<{ data?: any }> {
        try {
            const response = await axios.post(`${config.service.usermanagement}/user/profile`, { 
                headers: { authorization: token }
            });

            if (response.status === 200 && response.data['Data '].success) {
                return { data: response.data['Data '].data };
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }

    async updateItem(token: string,dataobject:any): Promise<{ data?: any }> {
        try {
            const response = await axios.put(`${config.service.usermanagement}/user/profile`, 
                dataobject,
                { 
                    headers: { authorization: token }
                }
            );

            if (response.status === 200) {
                return { data: response };
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }

    async updateGalleryItem(token: string,dataobject:any): Promise<{ data?: any }> {
        try {
            const response = await axios.put(`${config.service.usermanagement}/user/gallery`, 
                dataobject,
                { 
                    headers: { authorization: token }
                }
            );

            if (response.status === 200) {
                return { data: response };
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }

    async updateIdentityItem(token: string,dataobject:any): Promise<{ data?: any }> {
        try {
            const response = await axios.put(`${config.service.usermanagement}/user/identity`, 
                dataobject,
                { 
                    headers: { authorization: token }
                }
            );

            if (response.status === 200) {
                return { data: response };
            } else {
                return { data: null }; 
            }
        } catch (error) {
            return { data: error };
        }
    }
    
}
