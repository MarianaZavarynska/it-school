// Отримання ID користувача з параметрів URL
const url = new URLSearchParams(window.location.search); //Це об’єкт класу URLSearchParams, 
// який дозволяє отримувати доступ до параметрів URL.
// Він створюється за допомогою конструктора new URLSearchParams() 
const userId = url.get('id');
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams


function displayUserDetails(user, container) {
    
    for (const key in user) {
        const userDetailsCardBodyText = document.createElement('div');
        userDetailsCardBodyText.classList.add("d-flex", 'card-text');

        const userDetailsCardBodyTextKey = document.createElement('p');
        userDetailsCardBodyTextKey.innerText = `${key}:  `;

        const userDetailsCardBodyTextValue = document.createElement('p');


        // Recursion!!!!

        // TODO: покращити перевівку
        if(typeof user[key] === "object"){
            displayUserDetails(user[key], userDetailsCardBodyTextValue)
        } else {
            userDetailsCardBodyTextValue.innerText =  user[key];  
        }

        userDetailsCardBodyText.appendChild(userDetailsCardBodyTextKey);
        userDetailsCardBodyText.appendChild(userDetailsCardBodyTextValue);

        container.appendChild(userDetailsCardBodyText);
    }

}

// Отримання даних про користувача з сервера
fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        // Вставка даних про користувача в блок

        const userDetailsCardBody = document.getElementById('user-details');

        displayUserDetails(user, userDetailsCardBody)

        const userDetailsCardBodyTextButton = document.createElement("button");
        userDetailsCardBodyTextButton.classList.add("btn", "btn-primary", "my-3");
        userDetailsCardBodyTextButton.innerText = "Posts of current user";
        userDetailsCardBodyTextButton.id = "user-posts-btn";


        userDetailsCardBody.appendChild(userDetailsCardBodyTextButton);

        const userButton = document.getElementById('user-posts-btn');
        userButton.addEventListener('click', () => {
            getPostsForUser(userId);
        });
    });

function getPostsForUser(userId) {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(response => response.json())
        .then(posts => {
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = ''; // Очищуємо контейнер перед додаванням нових постів
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('card', 'mb-3', 'bg-light', 'border-info');
                postDiv.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title text-info">Title: ${post.title}</h3>
                        <button class='butPost btn btn-info' data-post-id='${post.id}'>Details</button>
                    </div>
                `;
                postContainer.appendChild(postDiv);
            });

            // Після додавання всіх постів до контейнера, додаємо обробник події для кнопок "Details"
            const buttons = document.querySelectorAll('.butPost');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const postId = button.getAttribute('data-post-id');
                    window.location.href = `../post/post-details.html?postId=${postId}`;
                });
            });
        });
}
