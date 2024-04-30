import createUser from "../support/createUser";
const CreateUser = new createUser();
import searchUser from "../support/searchUser";
const SearchUser = new searchUser()

Cypress.Commands.add('deleteUser', function(userId) {
    cy.request({
        method: 'DELETE',
        url: 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users/' + userId,
    })
  });

Cypress.Commands.add('accessNewUserPage', function () {
  cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users').then(function (){
    SearchUser.getNewUser()
  })
});

Cypress.Commands.add('novoUsuario', function(name, email){
  CreateUser.typeName(name);
  CreateUser.typeEmail(email);
  CreateUser.buttomSave();
});