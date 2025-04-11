import axios from "axios"

export const httpPost = (url: string, formData: object, queryParams: object) => {
    return axios.post(url, formData, {
        params: queryParams,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}