function fetchAllUsers() {
    fetch('http://localhost:3333/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = '';
            data.users.forEach((user) => {
                const row = document.createElement('tr');
                row.innerHTML = `
        <th scope="row">${user.id}</th>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
            <button class="btn btn-primary btn-sm edit-btn" data-id="${user.id}">Editar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Deletar</button>
        </td>
    `;
                usersTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

fetchAllUsers(); 

//Busca todos os usuários e mostra na tabela

//Função para buscar os usuários
function searchUser(userId) {

    if (userId == '') {
        fetchAllUsers();
    } else {

        fetch(`http://localhost:3333/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response.json();
            })

            .then(data => {
                const usersTableBody = document.getElementById('usersTableBody');
                usersTableBody.innerHTML = '';

                const row = document.createElement('tr');
                row.innerHTML = `
            <th scope="row">${data.user.id}</th>
            <td>${data.user.name}</td>
            <td>${data.user.email}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-id="${data.user.id}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${data.user.id}">Deletar</button>
                </td>
                `;
                usersTableBody.appendChild(row);
            })
            .catch(error => {
                console.error('Error:', error);
                createErrorAlert('Usuário não encontrado ou erro');
            });
    }
} 
//Função para deletar o usuário selecionado
function deleteUser(userId) {
    fetch(`http://localhost:3333/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            createSuccessAlert('Usuário deletado', data);
        })
        .catch(error => console.error('Error:', error));
}

//Função para editar o usuário selecionado
function editUser(userId) {

    const newUserName = document.getElementById('userName').value;
    const newUserEmail = document.getElementById('userEmail').value;

    fetch(`http://localhost:3333/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: newUserName,
            email: newUserEmail
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();

        })
        .then(data => {
            createSuccessAlert('Usuário alterado', data);
        })
        .catch(error => console.error('Error:', error));
}

//Adiciona funcionabilidade para os botões
document.addEventListener('click', function (e) {

    if (e.target.classList.contains('delete-btn')) {
        const userId = e.target.getAttribute('data-id');
        deleteUser(userId);
    }

    else if (e.target.classList.contains('edit-btn')) {
        const userId = e.target.getAttribute('data-id');
        modalHandling(userId);
    }

    else if (e.target.classList.contains('search-btn')){
        const searchId = document.getElementById('searchInput').value;
        searchUser(searchId);
    }

});
 
//Logica para o Modal de edição do usuário
function modalHandling(userId) {
    var myModal = new bootstrap.Modal(document.getElementById('editUserModal'), {
        keyboard: false
    });

    fetch(`http://localhost:3333/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("userName").value = data.user.name; 
        document.getElementById("userEmail").value = data.user.email;
        myModal.show();
    })
    .catch(error => {
        console.error('Error:', error);
    });

    const modalLabel = document.getElementById('editUserModalLabel');
    modalLabel.innerText = `Editar usuário: ${userId}`

    document.getElementById('saveChanges').addEventListener('click', function () {
        editUser(userId);
        myModal.hide();
    });

}

//Cria alertas de sucesso ou erro para o usuário ao realizar funções no sistema
function createErrorAlert(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.zIndex = '9999';
    document.body.prepend(errorDiv);


    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 3000);
}

function createSuccessAlert(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-success';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.zIndex = '9999';
    document.body.prepend(errorDiv);


    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 3000);
}
