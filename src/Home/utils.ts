import axios from 'axios';
import CryptoJS from 'crypto-js';
const secretKey = '5TfjOseEwf';
const encryptData = (data: { country: any; region: any; city: any; }) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const getInfo = async () => {
    try {
        const response = await axios.get('https://ipapi.co/json/');
        const country = response.data.country_name;
        const city = response.data.city;
        const region = response.data.region;

        return {
            unit: country === 'United States' ? 'inches' : 'cm',
            city,
            region, country
        };
    } catch (error) {
        return { unit: 'cm', city: 'Unknown', region: 'Unknown', country: 'Unknown' };
    }
};

export const trackEvent = (eventName: any, metadata?: any) => {
    if (window.sa_event) {
        if (metadata === undefined) window.sa_event(eventName);
        else window.sa_event(eventName, metadata);
    }
};

export const sendTelegramNotification = async (country: string, region: string, city: string) => {
    try {
        const encryptedMessage = encryptData({ country, region, city });
        await axios.post(`https://hook.eu2.make.com/uapah84dfs1jl3cfgvm89jkumvqf58tf`, { d: encryptedMessage });
    } catch (error) {
    }
};