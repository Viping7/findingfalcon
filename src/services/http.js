import axios from "axios";
import config from "../config.js";
const baseUrl = config.baseUrl;
export const http = (method, url, payload,header) => {
    var url = `${baseUrl}${url}`;
    return new Promise(function (resolve, reject) { 
        var options = {
            method: method,
            url: url
        }
        if(method === 'post' || method === 'put'){
            options.data = payload;
        }  
        if(header){
            options.headers = header
        }
        axios(options).then(function (data) {
            if (data) {
                resolve(data);
            }
        },function(error){
            reject(error);
        })
    })
}