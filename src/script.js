const clientId = '49d02cafb277423e8cbee4e3b37202b1';
const clientSecret = 'e3a5b9e6378549c399a3ea576065aa99';

$(function() {
	getSpotifyApiToken();
});

async function getSpotifyApiToken() {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    console.log(data.access_token);
}



const _getGenres = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.categories.items;
}