const clientId = '49d02cafb277423e8cbee4e3b37202b1';
const clientSecret = 'e3a5b9e6378549c399a3ea576065aa99';

$(function() {
	getSpotifyCategories()
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
    return data.access_token;
}

async function getSpotifyJsonCategories(token) {

    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_BR`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.categories
}

async function getSpotifyCategories() {
    const token = await getSpotifyApiToken();
    const data = await getSpotifyJsonCategories(token);

    for (let i = 0; i < 10; i++) {
        const categorie = getTranslatedContent(data.items[i].name);
        $(".categories").append(`<p>${data.items[i].name}</p>`);
    }
}

function getTranslatedContent(text) {
    $.ajax(`https://api.mymemory.translated.net/get?q=`
        + `${text}&langpair=en|pt`, {
        type: 'GET',
        beforeSend: function () {
            $('.table').after('<p class="loading"> carregando ... </p>')
        },
        error: function () {
            $('.table').after('<p class="loading"> deu ruim </p>')
        },
        success: function (dados) {
            return dados.responseData.translatedText
        }
    });
}
