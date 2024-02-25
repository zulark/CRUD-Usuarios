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
            createErrorAlert('Usuário deletado:', data);
        })
        .catch(error => console.error('Error:', error));
}

function editUser(userId) {

    fetch(`http://localhost:3333/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            createSuccessAlert('Usuário alterado');
        })
        .catch(error => console.error('Error:', error));
}

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


document.addEventListener('click', function (e) {

    if (e.target.classList.contains('delete-btn')) {
        const userId = e.target.getAttribute('data-id');
        deleteUser(userId);
    }
    else if (e.target.classList.contains('edit-btn')) {
        const userId = e.target.getAttribute('data-id');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchBtn').addEventListener('click', function () {
        const searchId = document.getElementById('searchInput').value;
        searchUser(searchId);
    });
});


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
