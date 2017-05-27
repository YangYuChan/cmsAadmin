/**
 * Created by Administrator on 2017/5/16.
 */
function getError(action, option, xhr) {
    let msg;
    if (xhr.response) {
        msg = `${xhr.status} ${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
        msg = `${xhr.status} ${xhr.responseText}`;
    } else {
        msg = `fail to post ${action} ${xhr.status}'`;
    }

    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = action;
    return err;
}

function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

export default function upload(files,option){
    if(files){
            files.map(file => {
                ajax(Object.assign({
                    action:'',
                    onProgress:function () {
                    },
                    onSuccess:function () {
                    },
                    onError:function () {

                    },
                    onStart:function () {

                    }
                },option,{
                    filename:file.name,
                    file:file
                }))
            })
    }
}

function ajax(option) {

    if (typeof XMLHttpRequest === 'undefined') {
        return;
    }

    const xhr = new XMLHttpRequest();
    const action = option.action;

    if (xhr.upload) {
        xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e,option.file);
        };
    }

    const formData = new FormData();

    if (option.data) {
        Object.keys(option.data).map(key => {
            formData.append(key, option.data[key]);
        });
    }

    formData.append('file', option.file);

    xhr.onerror = function error(e) {
        option.onError(e,option.file);
    };

    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr),option.file);
        }
        let res=getBody(xhr);
        if(res.code==0){
            option.onSuccess(res.data,option.file);
        }else {
            option.onError(new Error(res.msg),option.file)
        }
    };
    xhr.onloadstart=function onStart() {
        option.onStart(option.file)
    };
    xhr.open('post', action, true);

    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    const headers = option.headers || {};

    for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item]);
        }
    }
    xhr.send(formData);
    return xhr;
}
