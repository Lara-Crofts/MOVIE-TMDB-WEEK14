// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('movieForm');
    const list = document.getElementById('grid');



    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const movie = document.getElementById('userInput').value;

        console.log('Submitting form with movie:', movie);


        
        list.innerHTML = '';
        fetch('http://localhost:5500/similar?movie=' + movie)
            .then(response => response.json())
            .then(data => {
                console.log('Received data:', data);

                if (data.error) {
                    console.error(data.error);
                } else {
                    for (let i = 0; i < data.length; i++) {
                        // Create a paragraph element for the title
                        let titleElement = document.createElement('p');
                        // Assuming data[i] is the movie title
                        titleElement.textContent = data[i];
                        list.appendChild(titleElement);
                    }
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
