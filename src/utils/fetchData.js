import axios from 'axios'

const host = 'http://127.0.0.1:8080'

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`${host}/api/${url}`, {
        headers: { Authorization: token}
    })
    return res;
}

export const postDataAPI = async (url, post, token) => {
    const res = await axios.post(`${host}/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`${host}/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const patchDataAPI = async (url, post, token) => {
    const res = await axios.patch(`${host}/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`${host}/api/${url}`, {
        headers: { Authorization: token}
    })
    return res;
}