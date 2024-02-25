document.addEventListener('DOMContentLoaded', () => {

    window.onload = document.getElementById("userEmail").value = ""; 
    document.getElementById("userName").value = "";
    
    document.getElementById('registrationForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('userName').value.trim();
        const useremail = document.getElementById('userEmail').value.trim();

        if (!username || !useremail) {
            console.error('Username and email are required.');
            createErrorAlert('É necessário inserir o nome usuário e o email do usuário.')
            return;
        }

        fetch('http://localhost:3333/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email: useremail
        }),

        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            createSuccessAlert('Usuário cadastrado.');
            userName.value = '';
            userEmail.value = '';
        })
        .catch(error => {
            console.error('Error:', error.message);
            createErrorAlert(`Erro ao cadastrar usuário: status ${error.message}`);
       });
    });
});

function createErrorAlert(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
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
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.setAttribute('role', 'alert');
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '0';
    successDiv.style.left = '0';
    successDiv.style.width = '100%';
    successDiv.style.zIndex = '9999';
    document.body.prepend(successDiv);

    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}
