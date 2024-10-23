import axios from 'axios';

export const getUnit = async () => {
    try {
        const response = await axios.get('https://ipapi.co/json/');
        const country = response.data.country_name;

        return country === 'United States' ? 'inches' : 'cm';
    } catch (error) {
        return 'cm';
    }
};
