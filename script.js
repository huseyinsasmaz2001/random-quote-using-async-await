// Attend que le DOM soit entièrement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function () {
    // Récupère les éléments HTML par leur identifiant
    const quote = document.getElementById('quote');
    const author = document.getElementById('author');
    const photo = document.getElementById('photo');
    const button = document.getElementById('btn');
    const loader = document.getElementById('loader');

    // Fonction pour afficher le loader
    let showLoader = () => {
        loader.style.display = 'block'; // Affiche le loader
    };

    // Fonction pour effectuer la requête API
    let fetchQuote = () => fetch("https://thatsthespir.it/api");

    // Fonction pour mettre à jour le contenu HTML avec les données de la citation
    let updateHTML = (json) => {
        quote.innerHTML = json.quote;

        // Ajuste la taille de la police en fonction de la longueur de la citation
        if (json.quote.length < 250) {
            quote.style.fontSize = "2rem";
        }
        else if (json.quote.length > 250 && json.quote.length <= 400) {
            quote.style.fontSize = "1rem";
        }
        else if (json.quote.length > 400) {
            quote.style.fontSize = "0.5rem";
        }

        // Affiche l'auteur de la citation
        author.innerHTML = `-${json.author}`;
        
        // Cache le loader une fois les données mises à jour
        loader.style.display = 'none';
    };

    // Fonction pour charger une image de manière asynchrone
    let loadImage = (src) => {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Fonction pour effectuer la requête Agify
    let fetchAge = (name) => fetch(`https://api.agify.io?name=${name}`);

    // Fonction pour mettre à jour l'âge dans le HTML
    let updateAge = (age) => {
        // Affiche l'âge dans le HTML
        author.innerHTML += ` (Age: ${age})`;
    };

    // Fonction pour extraire le prénom de l'auteur
    let extractFirstName = (fullName) => {
        let names = fullName.split(' ');
        return names.length > 0 ? names[0] : fullName;
    };

    // Fonction pour obtenir l'âge de l'auteur
    let getAuthorAge = async (authorName) => {
        try {
            // Effectue la requête Agify pour obtenir l'âge
            let response = await fetchAge(authorName);
            let ageData = await response.json();
            
            // Vérifie si l'âge a été trouvé
            if (ageData.age) {
                updateAge(ageData.age);
            } else {
                // Gère le cas où l'âge n'a pas été trouvé
                console.warn(`Age not found for ${authorName}`);
            }
        } catch (error) {
            // Gère les erreurs lors de la requête Agify
            console.error('Error fetching age from Agify:', error);
        }
    };

    // Effectue la première requête API lors du chargement initial de la page
    fetchQuote()
        .then((response) => response.json())
        .then(async (json) => {
            // Charge l'image de manière asynchrone
            let img = await loadImage(json.photo);
            // Affiche l'image sur la page
            photo.src = img.src;
            // Met à jour le contenu HTML avec les données de la citation
            updateHTML(json);

            // Obtient le prénom de l'auteur
            let firstName = extractFirstName(json.author);

            // Obtient et affiche l'âge de l'auteur
            await getAuthorAge(firstName);
        })
        .catch((error) => {
            // Affiche une alerte en cas d'erreur lors de la requête initiale
            alert("There was an error!", error);
        });

    // Ajoute un écouteur d'événement sur le bouton pour déclencher une nouvelle requête API
    button.addEventListener('click', () => {
        // Affiche le loader avant de lancer la nouvelle requête API
        showLoader();
        // Effectue une nouvelle requête API
        fetchQuote()
            .then((response) => response.json())
            .then(async (json) => {
                // Charge l'image de manière asynchrone
                let img = await loadImage(json.photo);
                // Affiche l'image sur la page
                photo.src = img.src;
                // Met à jour le contenu HTML avec les données de la nouvelle citation
                updateHTML(json);

                // Obtient le prénom de l'auteur de la nouvelle citation
                let newFirstName = extractFirstName(json.author);

                // Obtient et affiche l'âge de l'auteur de la nouvelle citation
                await getAuthorAge(newFirstName);
            })
            .catch((error) => {
                // Affiche une alerte en cas d'erreur lors de la nouvelle requête
                alert("Image not found, please try another Quote", error);
            });
    });
});
