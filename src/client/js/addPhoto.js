const cityPhoto = document.getElementById("city-photo");
const pixbay_api_key = "18279000-ebcbb158a9cadb3318d8a56d0"


async function addPhoto(city){
    let imageURL = await fetch(`https://pixabay.com/api/?key=${pixbay_api_key}&q=${city}&image_type=photo`)
    .then(response => response.json())
    .then(data => `${data["hits"][0]["previewURL"]}`);

    return imageURL;
}

export {
    addPhoto,
    pixbay_api_key,
    cityPhoto
}