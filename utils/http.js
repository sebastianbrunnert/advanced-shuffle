import Router from "next/router";

export class HttpRequest {

    constructor() {
        this.url = "https://api.spotify.com/v1/me";
        this.headers = {}
        this.body = null;
        if (typeof window !== "undefined") {
            if(localStorage.getItem("token") != null)
                this.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
        }
    }

    setBody(body) {
        this.body = body;
    }

    setUrl(url) {
        this.url = url;
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    addHeader(key, value) {
        this.headers[key] = value;
    }

    post() {
        return new Promise((resolve, reject) => {
            const data = {
                method: "POST",
                headers: this.headers
            }
            
            if (this.body != null) {
                data.headers["Content-Type"] = "application/json";
                data.body = JSON.stringify(this.body);
            }
    
            fetch(this.url, data).then((response) => {
                if(response.status >= 200 && response.status < 300) {
                    resolve(response.status == 204 ? {} : response.json());
                    return;
                }
                if (typeof window !== "undefined") {
                    Router.push("/");
                    reject("Error: " + response.status);
                }
            });
        });
    }

    get() {
        return new Promise((resolve, reject) => {
            fetch(this.url, {
                method: "GET",
                headers: this.headers
            }).then((response) => {
                if(response.status >= 200 && response.status < 300) {
                    resolve(response.status == 204 ? {} : response.json());
                    return;
                }
                if (typeof window !== "undefined") {
                    Router.push("/");
                    reject("Error: " + response.status);
                }
            });
        });
    }

}