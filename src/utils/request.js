import axios from 'axios';
import qs from 'qs';
import AES from 'crypto-js/aes';
import HmacMD5 from 'crypto-js/hmac-md5';
import store from 'store';

axios.defaults.baseURL = 'https://www.tonghangbao178.com/api/';

axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    return response;
}, function(error) {
    // 对响应错误做点什么
    console.log(error);
    return Promise.reject(error);
});
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

/* ****************** no token********************************* */
export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params,
        }).then((response) => {
            resolve(response);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export const post = (url, payload = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, payload).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const put = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.put(url, params).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const del = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.delete(url, params).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};


/* ******************token********************************* */
export const getToken = (url, token, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
            },
        }).then((response) => {
            resolve(response);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export const postToken = (url, token, payload = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
            },
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const putToken = (url, token, payload = {}) => {
    return new Promise((resolve, reject) => {
        axios.put(url, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
            },
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const delToken = (url, token, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            params,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
            },
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

/* ****************** get token********************************* */
export function getAuth(url,openid){
    if(!openid&&!store.get("user")){return null};
    var pass =  AES.encrypt(url+":"+new Date().getTime(), 'asdhjkahsdasiu13jh1kh!@#%$^08ASD大苏打和！@#xcv');
    return "bearer "+(openid?openid : store.get("user").openid)+":"+pass;
}

/* ******************** login in  login out**************************** */
export function loginIn(userId,openid) {
    store.set('user', { userId,openid });
}

export function loginOut() {
    store.remove('user');
}

/* *********************** 格式化时间戳 ************************************** */
export function formatDate(dateTime) {
    var d = new Date(dateTime);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

export function formatDateDetail(dateTime) {
    var d = new Date(dateTime);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}