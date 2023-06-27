let lastCalled = 0;

async function call_home_assistant_api(value) {

    let now = Date.now();
    if (now - lastCalled < 1000) {
        // Moins d'une seconde s'est écoulée depuis le dernier appel, donc on ne fait rien.
        return;
    }
    lastCalled = now;

    let bearer_token = await new Promise((resolve, reject) => {
        chrome.storage.local.get('bearer_token', function (result) {
            resolve(result.bearer_token);
        });
    });

    let instance_url = await new Promise((resolve, reject) => {
        chrome.storage.local.get('instance_url', function (result) {
            resolve(result.instance_url);
        });
    });

    let entity_id = await new Promise((resolve, reject) => {
        chrome.storage.local.get('entity_id', function (result) {
            resolve(result.entity_id);
        });
    });

    let worker_url = await new Promise((resolve, reject) => {
        chrome.storage.local.get('worker_url', function (result) {
            resolve(result.worker_url);
        });
    });

    let api_url = instance_url + '/api/services/input_number/set_value';
    let url = worker_url + '?url=' + encodeURIComponent(api_url);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + bearer_token);

    let data = {};
    data.entity_id = entity_id;
    data.value = value;

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
        }
    } catch (error) {
        console.log('Fetch error: ' + error.message);
    }
}
    
function calc_percent(current, total) {
    return Math.round((current / total) * 100);
}

setTimeout(() => {
    const videoElem = document.querySelector("video");
    if (videoElem) {
        videoElem.addEventListener("timeupdate", function(event) {
            let percent = calc_percent(event.target.currentTime, event.target.duration);
            call_home_assistant_api(percent);
        });
    }
}, 1000);

document.addEventListener('DOMContentLoaded', function () {
    const bearer_token = document.getElementById('bearer_token');
    const instance_url = document.getElementById('instance_url');
    const entity_id = document.getElementById('entity_id');
    const worker_url = document.getElementById('worker_url');
  
    // Restoring values from localStorage.
    chrome.storage.local.get('bearer_token', function (result) {
        if(result.bearer_token === undefined) {
            bearer_token.value = '';
        }else{
            bearer_token.value = result.bearer_token;
        }
    });
    chrome.storage.local.get('instance_url', function (result) {
        if(result.instance_url === undefined){
            instance_url.value = '';
        }else{
            instance_url.value = result.instance_url;
        }
    });
    chrome.storage.local.get('entity_id', function (result) {
        if(result.entity_id === undefined) {
            entity_id.value = '';
        }else{
            entity_id.value = result.entity_id;
        }
    });
    chrome.storage.local.get('worker_url', function (result) {
        if(result.worker_url === undefined) {
            worker_url.value = '';
        }else{
            worker_url.value = result.worker_url;
        }
    });
  
    document.getElementById('save').addEventListener('click', function () {
        // Storing values to localStorage.
        chrome.storage.local.set({bearer_token: bearer_token.value});
        chrome.storage.local.set({instance_url: instance_url.value});
        chrome.storage.local.set({entity_id: entity_id.value});
        chrome.storage.local.set({worker_url: worker_url.value});
        alert("Paramètres sauvegardés");
    });
  });
  
