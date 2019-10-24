import {get, getAuth, getToken, delToken, postToken, post, putToken } from "@/utils/request";

export async function singnIn() {
    return postToken(`/intergral`,await getAuth(`/intergral`))
        .then(data=>data.data).catch(err=>err)
}

export async function getIntergralRecords() {
    return getToken(`/intergral`,await getAuth(`/intergral`))
        .then(data=>data.data).catch(err=>err)
}