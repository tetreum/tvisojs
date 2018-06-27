class Tviso {
    constructor(id, secret) {
        this.id = id;
        this.secret = secret;

        this.METHOD_GET = "get";
        this.METHOD_POST = "post";
        this.BASE_URL = 'http://api.tviso.com/';
    }

    getAuthToken () {
        return new Promise((resolve, reject) => {
            if (typeof this.authToken === "undefined") {
                this.query("auth_token", {
                    'id_api': this.id,
                    'secret': this.secret,
                }, this.METHOD_POST).then((response) => {
                    this.authToken = response.auth_token;

                    resolve(this.authToken);
                });
            } else {
                resolve(this.authToken);
            }
        });
    }

    setUserToken (userToken) {
        this.userToken = userToken;
    }

    getUserToken (username, password) {
        return this.query("user/user_token", {
            'username': username,
            'password': password,
        }, this.METHOD_POST);
    }

    query (route, params, method) {
        if (typeof params === "undefined" || params == null) {
            params = {};
        }
        if (typeof method === "undefined" || method == null) {
            method = this.METHOD_GET;
        }

        return new Promise((resolve, reject) => {

            var makeQuery = (authToken) => {

                var request = {
                    method: method,
                };

                if (typeof authToken !== "undefined" && authToken != null) {
                    params.auth_token = authToken;
                }
                if (typeof this.userToken !== "undefined" && this.userToken != null) {
                    params.user_token = this.userToken;
                }

                var paramList;

                if (method === this.METHOD_POST) {
                    paramList = new FormData();
                } else {
                    paramList = new URLSearchParams();
                }

                for (var k in params) {
                    if (!params.hasOwnProperty(k)) {continue;}
                    paramList.append(k, params[k]);
                }

                if (method === "post") {
                    request.body = paramList;
                } else {
                    route = route + "?" + paramList;
                }

                fetch(this.BASE_URL + route, request)
                    .then(response => response.json().then((response) => {
                        resolve(response);
                    }))
                    .catch(error => reject(error));
            }

            if (route === "auth_token") {
                makeQuery();
            } else {
                this.getAuthToken().then(makeQuery);
            }
        });
    }
}
