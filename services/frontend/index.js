function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');
    const searchButton = document.getElementById("searchButton");
    const resetButton = document.getElementById("resetButton");
    const openBookForm = document.getElementById("openBookForm");

    function renderSearchedBook(id) {
        fetch(`http://localhost:3000/product/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(book => {
                books.innerHTML = "";
                books.appendChild(newBook(book));
            })
            .catch(error => console.error("Erro ao buscar livro: ", error))
    }

    searchButton.addEventListener("click", function () {
        const query = document.getElementById("searchInput").value.trim();
        if (query) {
            renderSearchedBook(query);
        } else {
            alert("Insira um ID válido.");
        }
    });

    resetButton.addEventListener("click", function () {
        books.innerHTML = "";
        fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });
            }
        });
    })

    openBookForm.addEventListener("click", function () {
        const div = document.createElement('div');
        if (document.getElementById("bookFormContainer")) {
            return; 
        }
        div.id="bookFormContainer";
        div.innerHTML = `
            <div>
                <form>
                    <label>Inserir dados do novo livro</label>
                    <br>
                    <label for="name">Nome:</label>
                    <input type="text" id="name" name="name">
                    <br>
                    <label for="author">Autor:</label>
                    <input type="text" id="author" name="author">
                    <br>
                    <label for="quantity">Quantidade:</label>
                    <input type="number" id="quantity" name="quantity" min="1">
                    <br>
                    <label for="price">Preço:</label>
                    <input type="number" id="price" name="price" min="1">
                    <br>
                    <label for="photo">Capa:</label>
                    <input type="text" id="photo" name="photo">
                    <br>
                    <button type="submit" id="submitBook">Adicionar</button>
                </form>
                <button type="button" id="closeBookForm">Fechar</button>
            </div>
        `
        document.querySelector(".bookForm").appendChild(div);

        document.getElementById("closeBookForm").addEventListener("click", function () {
            div.remove();
        });

        document.getElementById("bookForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const bookData = {
                name: document.getElementById("name").value,
                quantity: parseInt(document.getElementById("quantity").value),
                price: parseFloat(document.getElementById("price").value),
                photo: document.getElementById("photo").value,
                author: document.getElementById("photo").value,
            }

            fetch("http://localhost:3000/product", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(bookData)
            })
            .then(response => response.json())
            .then(data => {
                alert("Livro adicionado com sucesso!");
                div.remove();
            })
            .catch(error => {
                console.error("Erro ao adicionar livro: ", error);
                alert("Erro ao adicionar livro!");
            })
        })
    })

    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });

            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
});


