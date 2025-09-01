import axios, { AxiosPromise } from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;
export function httpPost<T>(url: string, formData: object, queryParams: object): AxiosPromise<T> {
    return axios
        .post<T>(url, formData, {
            params: queryParams,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((error) => {
            handleAxiosError(error);
            return Promise.reject(error); // so caller knows there was an error
        });
}

export function httpGet<T>(url: string, queryParams?: object): AxiosPromise<T> {
    return axios
        .get<T>(url, {
            params: queryParams,
        })
        .catch((error) => {
            handleAxiosError(error);
            return Promise.reject(error);
        });
}

function handleAxiosError(error: any) {
    if (error.response) {
        const { type, message } = error.response.data;
        if (type === 'error') toast.error(message || 'Something went wrong');
    } else {
        toast.error('Network or server error');
    }
}
