document.addEventListener("DOMContentLoaded", function() {
    var currentCard = null;

    var cardModalElement = document.querySelector('#cardModal');
    var cardModalInstance = new bootstrap.Modal(cardModalElement);
    var editModalElement = document.querySelector('#editModal');
    var editModalInstance = new bootstrap.Modal(editModalElement);

    document.querySelector('#addCardButton').addEventListener('click', function() {
        var selectedValue = document.querySelector('#selectOption').value;
        var qtdValue = document.querySelector('#qtdCards').value;

        if (qtdValue <= 0) {
            qtdValue = 1;
        } else if (qtdValue > 10) {
            qtdValue = 10;
        }

        fetch(`https://randomuser.me/api/?lego&gender=${selectedValue}&nat=br&inc=name,gender,email,picture,location,dob,phone&results=${qtdValue}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(function(item){
                    createNewCard(item);
                });

                cardModalInstance.hide();
            });
    });

    function createNewCard(item) {
        var cardContainer = document.querySelector('#cardContainer');

        var card = document.createElement('div');
        card.className = "card mt-4 mx-4";
        card.style.width = "600px";
        card.style.transition = 'transform 0.3s ease';

        var cardBody = document.createElement('div');
        cardBody.className = "card-body";

        var row = document.createElement('div');
        row.className = "row";

        var img = document.createElement('img');
        img.className = "mx-auto rounded-circle";
        img.style.height = "8rem";
        img.style.width = "16rem";
        img.src = item.picture.large;

        var div = document.createElement('div');
        div.className = "ml-4 text-light";

        var h5 = document.createElement('h5');
        h5.className = "card-title font-weight-bold ml-4";
        h5.textContent = `${item.name.first} ${item.name.last}`;

        var dob = document.createElement('p');
        dob.className = "card-text card-dob ml-4";
        dob.dataset.label = "Idade";
        dob.textContent = item.dob.age;

        var gender = document.createElement('p');
        gender.className = "card-text card-gender ml-4";
        gender.dataset.label = "Sexo";
        gender.textContent = item.gender;

        var email = document.createElement('p');
        email.className = "card-text card-email ml-4";
        email.dataset.label = "E-mail";
        email.textContent = item.email;

        var phone = document.createElement('p');
        phone.className = "card-text card-phone ml-4";
        phone.dataset.label = "Telefone";
        phone.textContent = item.phone;

        var country = document.createElement('p');
        country.className = "card-text card-country ml-4";
        country.dataset.label = "País";
        country.textContent = "LegoLândia";

        var street = document.createElement('p');
        street.className = "card-text card-street ml-4";
        street.dataset.label = "Endereço";
        street.textContent = `${item.location.street.name}, ${item.location.street.number} - ${item.location.city}`;

        var divButtons = document.createElement('div');
        divButtons.className = "d-flex justify-content-center w-100 mt-4";

        var editBtn = document.createElement('button');
        editBtn.className = "btn btn-primary editBtn m-2";
        editBtn.textContent = "Alterar";
        editBtn.addEventListener('click', editCard);

        var deleteBtn = document.createElement('button');
        deleteBtn.className = "btn btn-danger deleteBtn m-2";
        deleteBtn.textContent = "Deletar";
        deleteBtn.addEventListener('click', deleteCard);

        var gerarBtn = document.createElement('button');
        gerarBtn.className = "btn btn-success gerarBtn m-2";
        gerarBtn.textContent = "Gerar Senha";
        gerarBtn.addEventListener('click', generatePassword);

        div.appendChild(h5);
        div.appendChild(dob);
        div.appendChild(gender);
        div.appendChild(email);
        div.appendChild(phone);
        div.appendChild(country);
        div.appendChild(street);
        row.appendChild(img);
        row.appendChild(div);
        divButtons.appendChild(editBtn);
        divButtons.appendChild(deleteBtn);
        divButtons.appendChild(gerarBtn);
        cardBody.appendChild(row);
        cardBody.appendChild(divButtons);
        card.appendChild(cardBody);
        cardContainer.appendChild(card);

        card.addEventListener('mouseover', function() {
            card.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseout', function() {
            card.style.transform = 'scale(1)';
        });
    }

    function editCard(event) {
        currentCard = event.target.closest('.card');
        document.querySelector('#nameInput').value = currentCard.querySelector('.card-title').textContent;
        document.querySelector('#dobInput').value = currentCard.querySelector('.card-dob').textContent;
        document.querySelector('#genderInput').value = currentCard.querySelector('.card-gender').textContent;
        document.querySelector('#emailInput').value = currentCard.querySelector('.card-email').textContent;
        document.querySelector('#phoneInput').value = currentCard.querySelector('.card-phone').textContent;
        document.querySelector('#countryInput').value = currentCard.querySelector('.card-country').textContent;
        document.querySelector('#streetInput').value = currentCard.querySelector('.card-street').textContent;

        editModalInstance.show();
    }

    function deleteCard(event) {
        if (confirm("Tem certeza que deseja deletar o personagem " + event.target.closest('.card').querySelector('.card-title').textContent + "?")) {
            event.target.closest('.card').remove();
        }
    }

    function generatePassword(event) {
        currentCard = event.target.closest('.card');
        event.target.disabled = true;

        fetch(`https://randomuser.me/api/?inc=login`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(function(item){
                    var newCardPass = document.createElement('div');
                    newCardPass.className = "text-center";
                    newCardPass.innerHTML = `
                        <p><strong>Cadastro gerado com sucesso!</strong></p>
                        <p><strong>Login: </strong>${item.login.username}</p>
                        <p><strong>Senha: </strong>${item.login.password}</p>
                        <p>Utilize as credenciais acima para acessar o jogo!</p>
                    `;
                    currentCard.appendChild(newCardPass);
                });
            });
    }

    document.querySelector('#saveChangesButton').addEventListener('click', function() {
        if(currentCard) {
            currentCard.querySelector('.card-title').textContent = document.querySelector('#nameInput').value;
            currentCard.querySelector('.card-dob').textContent = document.querySelector('#dobInput').value;
            currentCard.querySelector('.card-gender').textContent = document.querySelector('#genderInput').value;
            currentCard.querySelector('.card-email').textContent = document.querySelector('#emailInput').value;
            currentCard.querySelector('.card-phone').textContent = document.querySelector('#phoneInput').value;
            currentCard.querySelector('.card-country').textContent = document.querySelector('#countryInput').value;
            currentCard.querySelector('.card-street').textContent = document.querySelector('#streetInput').value;

            editModalInstance.hide();
        }
    });
});
