import {get, getAuth, getToken, delToken, postToken, post, putToken } from "@/utils/request";

export async function getSysData(){
    return get('/sys').then(data=>data.data).catch(err=>err)
}

export async function userloginIn(){
    return getToken('/user/login',await getAuth(`/user/login`)).then(data=>data.data).catch(err=>err)
}

export async function getCompanyData(payload) {
    return get('/company/list',payload).then(data=>data.data).catch(err=>err)
}

export async function getUserListData(query) {
    return get('/user/list',query).then(data=>data.data).catch(err=>err)
}

export async function initCompanyDetailData(params) {
    return get(`/company/${params}`).then(data=>data.data).catch(err=>err)
}

export async function getRelation(params) {
    return getToken(`/company/relation/${params}`,await getAuth(`/company/relation/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function follow(params) {
    return getToken(`/company/follow/${params}`,await getAuth(`/company/follow/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function cancelFollow(params) {
    return delToken(`/company/follow/${params}`,await getAuth(`/company/follow/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function initUserDetail(params) {
    return get(`/user/${params}`).then(data=>data.data).catch(err=>err)
}

export async function followUser(params) {
    return getToken(`/user/follow/${params}`,await getAuth(`/user/follow/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function cancelFollowUser(params) {
    return delToken(`/user/follow/${params}`,await getAuth(`/user/follow/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function getUsereRelation(params) {
    return getToken(`/user/relation/${params}`,await getAuth(`/user/relation/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function initFollowCompanyMessage(params) {
    return getToken(`/company/followmessage`,await getAuth(`/company/followmessage`))
        .then(data=>data.data).catch(err=>err)
}

export async function initFollowUserMessage(params) {
    return getToken(`/user/followmessage`,await getAuth(`/user/followmessage`))
        .then(data=>data.data).catch(err=>err)
}

export async function releaseArt(payload) {
    return postToken(`/art`,await getAuth(`/art`),payload)
        .then(data=>data.data).catch(err=>err)
}

export  async function uploadImg(payload) {
    return post('/files',payload).then(data=>data.data).catch(err=>err)
}

export  async function regCompany(payload){
    return post('/company/reg',payload)
        .then(data=>data.data).catch(err=>err)
}

export  async function initInvitationRecord(payload){
    return getToken('/user/invitationRecord',await getAuth('/user/invitationRecord'))
        .then(data=>data.data).catch(err=>err)
}

export  async function updatefirst(payload){
    return putToken('/user/updatefirst',await getAuth('/user/updatefirst'),payload)
        .then(data=>data.data).catch(err=>err)
}

export  async function updateUser(payload){
    return putToken('/user/update',await getAuth('/user/update'),payload)
        .then(data=>data.data).catch(err=>err)
}

export  async function addCustomer(payload){
    return postToken('/customer/add',await getAuth('/customer/add'),payload)
        .then(data=>data.data).catch(err=>err)
}

export  async function initCustomerListData(payload){
    return getToken('/customer/list',await getAuth('/customer/list'))
        .then(data=>data.data).catch(err=>err)
}

export  async function initCustomerDetailData(params){
    return getToken(`/customer/list/${params}`,await getAuth(`/customer/list/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export  async function delOneCustomerData(params){
    return delToken(`/customer/list/${params}`,await getAuth(`/customer/list/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export  async function putCustomerData(payload){
    return putToken(`/customer/list`,await getAuth(`/customer/list`),payload)
        .then(data=>data.data).catch(err=>err)
}

export async function initDataList(payload){
    return get(`/art/${payload.type.title}`,payload.data)
        .then(data=>data.data).catch(err=>err)
}

export async function getArtPraiseList(params){
    return get(`/art/info/list/${params}`)
        .then(data=>data.data).catch(err=>err)
}

export async function praise(params){
    return getToken(`/art/praise/${params}`,await getAuth(`/art/praise/${params}`))
        .then(data=>data.data).catch(err=>err)
}

export async function postComment(payload){
    return postToken(`/art/comment/${payload.id}`,await getAuth(`/art/comment/${payload.id}`),payload.data)
        .then(data=>data.data).catch(err=>err)
}

export async function delArtById(params){
    return delToken(`/art/${params.id}`,await getAuth(`/art/${params.id}`))
        .then(data=>data.data).catch(err=>err)
}

export async function getArtListByUserId(params){
    return get(`/art/a/${params.id}`)
        .then(data=>data.data).catch(err=>err)
}

export async function getArtListByWhere(payload){
    return post(`/art/list`,payload)
        .then(data=>data.data).catch(err=>err)
}

export async function findCompanyByWhere(where){
    return get(`/company/find`,where)
        .then(data=>data.data).catch(err=>err)
}

export async function findUserByWhere(where){
    return get(`/user`,where)
        .then(data=>data.data).catch(err=>err)
}

export async function fetchCompanyUserList(params){
    return get(`/company/user/${params.id}`)
        .then(data=>data.data).catch(err=>err)
}

export async function fetchCompanyFollowUser(params){
    return get(`/company/f_u_arr/${params.id}`)
        .then(data=>data.data).catch(err=>err)
}

