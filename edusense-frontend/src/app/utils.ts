import axios, { AxiosPromise } from "axios"

export function httpPost<T>(url: string, formData: object, queryParams: object): AxiosPromise<T> {
    return axios.post<T>(url, formData, {
        params: queryParams,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}