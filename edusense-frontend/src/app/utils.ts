import axios, { AxiosPromise } from "axios"

axios.defaults.withCredentials = true;

export function httpPost<T>(url: string, formData: object, queryParams: object): AxiosPromise<T> {
    return axios.post<T>(url, formData, {
        params: queryParams,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function httpGet<T>(url: string, queryParams?: object): AxiosPromise<T> {
    return axios.get<T>(url, {
        params: queryParams,
    })
}