const { faker } = require('@faker-js/faker');

import searchUser from "../support/searchUser";
const SearchUser = new searchUser()

import createUser from "../support/createUser";
const CreateUser = new createUser()

const email = faker.random.alpha({ count: 5 }).toLowerCase() + '@sofia.com';
const name = faker.name.firstName();

describe('Listar usuários', () => {
  beforeEach(function () {
    cy.visit('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
  });

  it('lista vazia deve aparecer opção de cadastrar novo usuário', function () {
    cy.intercept('GET', 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users', []).as('emptyList');
    cy.wait('@emptyList');
    SearchUser.getNewUserPage()
  });

  it('Deve ser possível encontrar usuário existente', function () {
    SearchUser.getNewUser();
    CreateUser.typeName(name);
    CreateUser.typeEmail(email);
    CreateUser.buttomSave();
    cy.intercept('POST', 'https://rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users').as('newUser');
    cy.wait('@newUser').then(function () {
      cy.contains("Usuário salvo com sucesso!").should('be.visible')
    });
    CreateUser.getBack();

    SearchUser.finduserList(name)

  });
})  