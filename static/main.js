$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

function getMovies(searchText) {
    console.log(searchText);
    axios.get('http://www.omdbapi.com/?i=tt3896198&apikey=b1b5d454' + '&s=' + searchText)
        .then((response) => {
            console.log(response);
            let movies = response.data.Search;
            let output = '';
            $.each(movies, (index, movie) => {
                output += `
                    <div class = "col-md-3">
                        <div class="well text-center">
                            <img src="${movie.Poster}">
                            <h5>${movie.Title}</h5>
                            <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="movie.html">Detalhes</a>
                        </div>
                    </div>
                `;
            });
            $('#movies').html(output);
        }).catch((err) => {
            console.log(err);
        });
}

function movieSelected(id) {
    sessionStorage.setItem('imdbID', id);
    window.location = 'movie.html';
    return false;
}

function getMovie() {
    // Obter o ID do filme armazenado no sessionStorage
    let movieId = sessionStorage.getItem('imdbID');

    // Verificar se o ID do filme está presente
    if (!movieId) {
        alert('ID do filme não encontrado. Volte para a página de pesquisa.');
        window.location = 'index.html'; // Redirecionar para a página de pesquisa
        return;
    }

    // Chamar a API OMDB para obter detalhes do filme com base no ID
    axios.get('http://www.omdbapi.com/?apikey=b1b5d454&i=' + movieId)
        .then((response) => {
            // Verificar se a resposta da API é bem-sucedida
            if (response.data.Response === 'True') {
                let movie = response.data;

                // Construir o HTML para os detalhes do filme
                let output = `
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${movie.Poster}" class="thumbnail">
                        </div>
                        <div class="col-md-8">
                            <h2>${movie.Title}</h2>
                            <ul class="list-group">
                                <li class="list-group-item"><strong>Ano de Lançamento:</strong> ${movie.Year}</li>
                                <li class="list-group-item"><strong>Resumo do Plot:</strong> ${movie.Plot}</li>
                            </ul>
                        </div>
                    </div>
                `;

                // Adicionar o HTML ao elemento com id "movie" na página movie.html
                $('#movie').html(output);
            } else {
                // Caso a resposta da API seja falsa, exibir uma mensagem de erro
                alert('Erro ao obter detalhes do filme. Volte para a página de pesquisa.');
                window.location = 'index.html'; // Redirecionar para a página de pesquisa
            }
        })
        .catch((error) => {
            // Se ocorrer um erro na solicitação à API, exibir uma mensagem de erro
            console.error('Erro na solicitação à API:', error);
            alert('Erro ao obter detalhes do filme. Volte para a página de pesquisa.');
            window.location = 'index.html'; // Redirecionar para a página de pesquisa
        });
}