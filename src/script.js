const clientId = 'Your client id here'; //https://developer.spotify.com/dashboard/
const clientSecret = 'Your client secret here';
let selectedCardName;
let selectedPlaylistName;

$(function () {
    createCategoriesCards();
});

function getTranslatedContent(text) {
    return Promise.resolve(text);
    return fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|pt`).then(data => {
        return data.responseData.translatedText;
    });
}

function getToken() {
    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    }).then(result => {
        return result.json().then(json => {
            return json.access_token;
        })
    })
}

function getCategories(token) {
    return fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_BR`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(result => {
        return result.json().then(json => {
            return json.categories.items;
        });
    });
}

function createCategoriesCards() {
    getToken().then(token => {
        getCategories(token).then(categories => {
            categories.forEach(function callback(element, index) {
                getTranslatedContent(element.name).then(translatedText => {
                    $(".categories").append(getCategorieCardStructure(index));

                    $(`.card-img-${index}`).attr("src", element.icons[0].url);
                    $(`.card-text-${index}`).text(translatedText);

                })
            });
        });
    });
}

function createPlaylistsCards() {
    getToken().then(token => {
        getSelectedCategoryId(token).then(categoryId => {
            getPlaylist(token, categoryId).then(playlists => {
                playlists.forEach(function callback(element, index) {
                    $(".playlists").append(getPlaylistCardStructure(index));

                    $(`.pl-card-img-${index}`).attr("src", element.images[0].url);
                    $(`.pl-card-title-${index}`).text(element.name);
                    $(`.total-tracks-${index}`).text(`Faixas: ${element.tracks.total}.`);
                })
            });
        })
    });
}

function getSelectedCategoryId(token) {
    let categoryId;
    return getCategories(token).then(categories => {
        categories.forEach(function callback(element) {
            if (element.name == selectedCardName) {
                categoryId = element.id;
            }
        });
        return categoryId
    });
}

function getSelectedPlaylistUrl(token) {
    let playlistUrl;
    return getSelectedCategoryId(token).then(categoryId => {
        return getPlaylist(token, categoryId).then(playlists => {
            playlists.forEach(function callback(element) {
                if (element.name == selectedPlaylistName) {
                    playlistUrl = element.external_urls.spotify;
                }
            })
            return playlistUrl;
        });
    });
}

function getCategorieCardStructure(classCode) {
    return `<div id="card-${classCode}" class="card" style="width: 10rem;">`
        + `<img class="card-img-top card-img-${classCode}" alt="Categorie Icon">`
        + `<div class="card-body">`
        + `<p class="card-text card-text-${classCode}"></p>`
        + `</div>`
        + `</div>`
}

function getPlaylistCardStructure(classCode) {
    return `<div id="pl-card-${classCode}" class="card" style="width: 10rem;">`
        + `<img class="card-img-top pl-card-img-${classCode}" alt="Playlist Icon">`
        + `<div class="card-body">`
        + `<h5 class="card-title pl-card-title-${classCode}"></h5>`
        + `<p class="card-text pl-card-text-${classCode}"></p>`
        + `</div>`
        + `<ul class="list-group list-group-flush">`
        + `<li class="list-group-item total-tracks-${classCode}"></li>`
        + `</ul>`
        + `</div>`
}

function getPlaylist(token, categoryId) {
    return fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(result => {
        return result.json().then(json => {
            console.log(json.playlists.items)
            return json.playlists.items;
        });
    })
}

function redirectToPlaylist() {
    getToken().then(token => {
        getSelectedPlaylistUrl(token).then(playlistUrl => {
            window.location.href = playlistUrl;
        })
    });
}

document.getElementById('cat').addEventListener('click', function (event) {
    selectedCardName = event.path[1].textContent || event.path[2].textContent
    createPlaylistsCards();
});

document.getElementById('pl').addEventListener('click', function (event) {
    selectedPlaylistName = event.path[1].textContent || event.path[2].textContent
    redirectToPlaylist()
});


