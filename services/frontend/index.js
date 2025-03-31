function newBook(book) {
    const div = document.createElement('div');
    div.className = 'card-container';
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
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

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

                const successNotification = document.createElement('div');
                successNotification.className = 'notification is-success is-light';
                successNotification.style.maxWidth = '800px';
                successNotification.style.margin = '0 auto 20px auto';
                successNotification.style.borderRadius = '6px';
                successNotification.style.boxShadow = '0 2px 3px rgba(10, 10, 10, 0.1)';
                successNotification.innerHTML = `
                    <button class="delete"></button>
                    <div class="columns is-vcentered">
                        <div class="column has-text-centered">
                            <p><strong>Livro encontrado!</strong> Exibindo "${book.name}" de ${book.author}.</p>
                        </div>
                    </div>
                `;
                books.insertAdjacentElement('beforebegin', successNotification);

                successNotification.querySelector('.delete').addEventListener('click', function () {
                    successNotification.remove();
                });

                setTimeout(() => {
                    if (document.body.contains(successNotification)) {
                        successNotification.style.opacity = '0';
                        successNotification.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => {
                            if (document.body.contains(successNotification)) {
                                successNotification.remove();
                            }
                        }, 500);
                    }
                }, 5000);
            })
            .catch(error => {
                console.error("Erro ao buscar livro: ", error);

                books.innerHTML = "";
                const errorNotification = document.createElement('div');
                errorNotification.className = 'notification is-danger is-light';
                errorNotification.style.maxWidth = '800px';
                errorNotification.style.margin = '0 auto 20px auto';
                errorNotification.style.borderRadius = '6px';
                errorNotification.style.boxShadow = '0 2px 3px rgba(10, 10, 10, 0.1)';

                errorNotification.innerHTML = `
                    <button class="delete"></button>
                    <div class="columns is-vcentered">
                        <div class="column has-text-centered">
                            <p class="has-text-weight-bold mb-1">Erro ao buscar livro!</p>
                            <p>Não foi possível encontrar um livro com o ID: ${id}.</p>
                            <p class="mt-2 is-size-7">Por favor, verifique o ID e tente novamente.</p>
                        </div>
                    </div>
                `;

                const notificationContainer = document.createElement('div');
                notificationContainer.className = 'container';
                notificationContainer.appendChild(errorNotification);
                books.appendChild(notificationContainer);

                errorNotification.querySelector('.delete').addEventListener('click', function () {
                    errorNotification.remove();
                });

                setTimeout(() => {
                    if (document.body.contains(errorNotification)) {
                        errorNotification.style.opacity = '0';
                        errorNotification.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => {
                            if (document.body.contains(errorNotification)) {
                                errorNotification.remove();
                            }
                        }, 500);
                    }
                }, 3000);
            });
    }

    searchButton.addEventListener("click", function () {
        const query = document.getElementById("searchInput").value.trim();
        if (query) {
            renderSearchedBook(query);
        } else {
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());

            const warningNotification = document.createElement('div');
            warningNotification.className = 'notification is-warning is-light';
            warningNotification.style.maxWidth = '800px';
            warningNotification.style.margin = '0 auto 20px auto';
            warningNotification.style.borderRadius = '6px';
            warningNotification.style.boxShadow = '0 2px 3px rgba(10, 10, 10, 0.1)';

            warningNotification.innerHTML = `
                <button class="delete"></button>
                <div class="columns is-vcentered has-text-centered">
                    <div class="column">
                        <p><strong>Busca vazia!</strong> Por favor, insira um ID válido para buscar.</p>
                    </div>
                </div>
            `;

            books.insertAdjacentElement('beforebegin', warningNotification);

            warningNotification.querySelector('.delete').addEventListener('click', function () {
                warningNotification.remove();
            });

            setTimeout(() => {
                if (document.body.contains(warningNotification)) {
                    warningNotification.style.opacity = '0';
                    warningNotification.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        if (document.body.contains(warningNotification)) {
                            warningNotification.remove();
                        }
                    }, 500);
                }
            }, 4000);
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
        if (document.getElementById("bookFormContainer")) {
            return;
        }

        const div = document.createElement('div');
        div.id = "bookFormContainer";
        div.className = "box mt-3 has-background-light";

        div.innerHTML = `
            <div>
                <h3 class="title is-4 has-text-centered mb-4">Adicionar Novo Livro</h3>
                <form id="bookForm">
                    <div class="field">
                        <label for="name" class="label">Nome do Livro</label>
                        <div class="control has-icons-left">
                            <input type="text" id="name" name="name" class="input" placeholder="Auto da Compadecida" required>
                        </div>
                    </div>
                    
                    <div class="field">
                        <label for="author" class="label">Autor</label>
                        <div class="control has-icons-left">
                            <input type="text" id="author" name="author" class="input" placeholder="Ariano Suassuna" required>
                        </div>
                    </div>
                    
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label for="quantity" class="label">Quantidade</label>
                                <div class="control has-icons-left">
                                    <input type="number" id="quantity" name="quantity" min="1" class="input" placeholder="1" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="column">
                            <div class="field">
                                <label for="price" class="label">Preço (R$)</label>
                                <div class="control has-icons-left">
                                    <input type="number" id="price" name="price" min="0.01" step="0.01" class="input" placeholder="29.90" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="field">
                        <label for="photo" class="label">URL da Imagem</label>
                        <div class="control has-icons-left">
                            <input type="text" id="photo" name="photo" class="input" placeholder="/img/book.png" required>
                        </div>
                    </div>    
                    
                    <div class="field is-grouped is-grouped-centered mt-5">
                        <div class="control">
                            <button type="submit" class="button is-success">
                                <span>Adicionar Livro</span>
                            </button>
                        </div>
                        <div class="control">
                            <button type="button" id="closeBookForm" class="button is-danger">
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        `;

        document.querySelector("#openBookForm").insertAdjacentElement('afterend', div);

        setTimeout(() => {
            div.style.opacity = "0";
            div.style.transition = "opacity 0.3s ease";
            setTimeout(() => { div.style.opacity = "1"; }, 50);
        }, 0);

        document.getElementById("closeBookForm").addEventListener("click", function () {
            div.style.opacity = "0";
            setTimeout(() => { div.remove(); }, 300);
        });

        document.getElementById("bookForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const bookData = {
                author: document.getElementById("author").value,
                name: document.getElementById("name").value,
                photo: document.getElementById("photo").value,
                price: parseFloat(document.getElementById("price").value),
                quantity: parseInt(document.getElementById("quantity").value),
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
                    swal({
                        title: "Sucesso!",
                        text: "Livro adicionado com sucesso!\nAtualize a página por favor",
                        icon: "success",
                        button: "Continuar",
                    });
                    div.style.opacity = "0";
                    setTimeout(() => { div.remove(); }, 300);
                })
                .catch(error => {
                    console.error("Erro ao adicionar livro: ", error);
                    swal({
                        title: "Erro!",
                        text: "Não foi possível adicionar o livro!",
                        icon: "error",
                        button: "Tentar novamente",
                    });
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