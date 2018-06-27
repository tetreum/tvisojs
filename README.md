# tvisojs
A Tviso (https://www.tviso.com/developers/) API wrapper.


# Usage

```js
var tviso = new Tviso(YOUR_APP_ID, YOUR_APP_SECRET);

tviso.getUserToken(YOUR_USERNAME, YOUR_PASSWORD).then (response => {
	tviso.setUserToken(response.user_token);
	
	tviso.query("user/me").then(response => console.log(response));
})
```
