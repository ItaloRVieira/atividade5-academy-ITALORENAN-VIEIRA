const { faker } = require('@faker-js/faker');

const email = faker.random.alpha({ count: 14 }) + '@meuemail.com';
const name = faker.name.firstName() + 'abcd';

import createUser from "../support/createUser";
const CreateUser = new createUser()

describe('Criar Usuários', () => {
  beforeEach(function () {
    cy.accessNewUserPage()
  });

  it('Deve ser possível criar usuário válido', function () {
    cy.novoUsuario(name, email).then(function () {
      cy.contains("Usuário salvo com sucesso!").should('be.visible')
    })
  });


  it('Não deve ser possível criar usuário com email já existente', function () {
    cy.novoUsuario(name, email).then(function () {
      cy.accessNewUserPage();
      cy.novoUsuario(name, email)
      cy.contains("Este e-mail já é utilizado por outro usuário.").should('be.visible')
    })
  })
});

describe('', () => {
  const name101 = faker.random.alpha({ count: 101 });
  const nameHundred = faker.random.alpha({ count: 100 });
  const email60 = faker.random.alpha({ count: 52 }) + '@net.com';
  const email61 = faker.random.alpha({ count: 53 }) + '@net.com';
  const email14 = faker.random.alpha({ count: 14 }) + '@meuemail14.com';
  beforeEach(function () {
    cy.accessNewUserPage()
  });

  it('Não deve ser possível criar usuário utilizando caracter especial no nome', () => {
    CreateUser.typeName(name + '#');
    CreateUser.typeName(email);
    CreateUser.buttomSave();
    cy.contains("Formato do nome é inválido.").should('be.visible')
  });

  it('Não deve ser possível criar usuário utilizando email com formato inválido', function () {
    CreateUser.typeName(name);
    CreateUser.typeEmail(name + name);
    CreateUser.buttomSave();
    cy.contains("Formato de e-mail inválido").should('be.visible')
  });

  it('Deve ser possível criar usuario com 100 caracteres no nome', function () {
    CreateUser.typeName(nameHundred);
    CreateUser.typeEmail(email14);
    CreateUser.buttomSave();
    cy.log(nameHundred);
    cy.contains("Usuário salvo com sucesso!").should('be.visible')
  });

  it('Não deve ser possível criar usuario com 101 caracteres no nome', function () {
    CreateUser.typeName(name101);
    CreateUser.typeEmail(email);
    CreateUser.buttomSave();
    cy.log(name101);
    cy.contains("Informe no máximo 100 caracteres para o nome").should('be.visible')
  });

  it('Deve ser possível criar usuário utilizando email com 60 caracteres', function () {
    CreateUser.typeName(name);
    CreateUser.typeEmail(email60);
    cy.contains('Salvar').click();
    cy.log(email60);
    cy.contains("Usuário salvo com sucesso!").should('be.visible')
  });

  it('Não deve ser possível criar usuário utilizando email com 61 caracteres', function () {
    CreateUser.typeName(name);
    CreateUser.typeEmail(email61);
    CreateUser.buttomSave();
    cy.log(email61);
    cy.contains("Informe no máximo 60 caracteres para o e-mail").should('be.visible')
  });

  //O site não aceita nome com menos de 4 caracteres
  it('Criar usuário com menos de 4 caracteres no nome', function () {
    CreateUser.typeName('ana');
    CreateUser.typeEmail(email);
    CreateUser.buttomSave();
    cy.log(email);
    cy.contains("Informe pelo menos 4 letras para o nome.").should('be.visible')
  });


})