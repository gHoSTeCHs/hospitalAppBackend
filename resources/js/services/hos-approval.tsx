import axios from 'axios';

export interface VerifyHospital {
    id: number;
    user_id: number;
    name: string;
    logo: string;
    hospital_code: string;
    verified: boolean;
    address: string;
}

const API_URL = 'http://127.0.0.1:8000';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

export const VerifyHospitalService = {
    getHospitals: async () => {
        try {
            const response = await axios.get(`${API_URL}/hospitals`);
            return response.data;
        } catch (e) {
            console.error('Error getHospitals', e);
        }
    },
};
