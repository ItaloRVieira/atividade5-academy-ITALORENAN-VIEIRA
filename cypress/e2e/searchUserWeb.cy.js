const { faker } = require('@faker-js/faker');

const email = faker.internet.email().toLowerCase();
const name = faker.name.firstName();
const namenotExist = faker.name.firstName() + 'lksdnas$#2lkndsalkn';

import createUser from "../support/createUser";
const CreateUser = new createUser()
import searchUser from "../support/searchUser";
const SearchUser = new searchUser()

describe('Pesquisar usuários', () => {
  let userId;
  before(function () {
    cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    SearchUser.getNewUser();
    CreateUser.typeName(name);
    CreateUser.typeEmail(email);
    CreateUser.buttomSave();
    cy.intercept('POST', 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users').as('newUser');
    cy.wait('@newUser').then(function (intercept) {
      const novoUsuario = intercept.response.body;
      userId = novoUsuario.id;
      cy.log(userId);
      cy.contains("Usuário salvo com sucesso!").should('be.visible')
    });
    CreateUser.getBack();
  });

  it('Deve ser possível pesquisar usuário existente por email', function () {
    SearchUser.typePesquisa(email)
    cy.intercept('GET', 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/search?value=' + email).as('listUsersEmail');
    cy.wait('@listUsersEmail');
    SearchUser.listFindUsers(name, email)
    SearchUser.viewuserDetails(userId, name, email)
  });

  it('Deve ser possível pesquisar usuário existente por nome', function () {
    cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    SearchUser.typePesquisa(name)
    cy.intercept('GET', 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/search?value=' + name).as('listUsersName');
    cy.wait(3000); //Ajustar posteriormente 
    SearchUser.listFindUsers(name, email)
    SearchUser.viewuserDetails(userId, name, email)
  });

  it('Pesquisar por usuário inexistente deve retornar mensagem de não encontrado', function () {
    cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    SearchUser.typePesquisa(namenotExist)
    cy.contains("Ops! Não existe nenhum usuário para ser exibido.").should('be.visible');
    SearchUser.getNewUserPage();
  });

})