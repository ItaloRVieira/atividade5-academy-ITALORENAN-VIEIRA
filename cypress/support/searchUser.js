import { expect } from "chai";

export default class searchUser {
    buttomSearch = 'input[placeholder="E-mail ou nome"]';
    buttomNext = '#paginacaoProximo';
    buttomPrevious = '#paginacaoVoltar';
    buttomNewUser = 'a[href="/users/novo"]';
    buttomNewUserPage = 'a[href="/users/novo"] > p'
    listUsers = '#listaUsuarios';
    listUser = '#userData';
    userName = '[data-test="userDataName"]';
    userEmail = '[data-test="userDataEmail"]';
    buttomDetailsUser = '#userDataDetalhe'
    valuedetailsID = 'form > input[name="id"]'
    valuedetailsName = '#userName'
    valuedetailsEmail = '#userEmail'


    typePesquisa(nome) {
        cy.get(this.buttomSearch).type(nome)
    };

    typePesquisa(email) {
        cy.get(this.buttomSearch).type(email)
    };

    listFindUsers(nome, email) {
        cy.get(this.listUser).within(() => {
            cy.get(this.userName).should('have.text', "Nome: " + nome);
            cy.get(this.userEmail).should(($element) => {
                const text = $element.text();
                const emailRegex = /E-mail:\s+(.+)/;
                const match = text.match(emailRegex);
                const displayedEmail = match ? match[1] : '';

                const cleanedDisplayedEmail = displayedEmail.replace(/\.{3}$/, '');

                const parts = cleanedDisplayedEmail.split('@');
                const displayedEmailPrefix = parts[0];

                expect(displayedEmailPrefix).to.equal(email.split('@')[0]);
            });
        });
    };

    getNext() {
        cy.get(this.buttomNext).click()
    };

    getPrevious() {
        cy.get(this.buttomPrevious).click()
    };

    getNewUser() {
        cy.get(this.buttomNewUser).click()
    }

    getNewUserPage(){
        cy.get(this.buttomNewUserPage).should('have.text', "Cadastre um novo usuário")
    }

    viewuserDetails(id, nome, email){
        cy.get(this.buttomDetailsUser).click()
        cy.get(this.valuedetailsID).should('have.value', id)
        cy.get(this.valuedetailsName).should('have.value', nome)
        cy.get(this.valuedetailsEmail).should('have.value', email)
    }

    //Por algum motivo o codigo quebra quando executado apenas no terminal, analisar posteriormente 
    async finduserList(nome, email) {
        let usuarioEncontrado = false;

        const verificarUsuario = ($el) => {
            const userName = $el.find(this.userName).text();

            if (userName.includes(nome)) {
                cy.wrap($el).as('usuarioEncontrado');
                usuarioEncontrado = true;
                return false; 

            }
        };

        const percorrerUsuarios = async () => {        
            await cy.get(this.listUsers).children().each(($el) => {
                verificarUsuario($el);
                if (usuarioEncontrado == true){
                    console.log(usuarioEncontrado)
                    return false;
                    
                }
            });
            
        };

        const verificarTodasPaginas = async () => {
            do {
                await percorrerUsuarios();
                if (usuarioEncontrado == false) {
                    cy.get(this.buttomNext).click();
                    cy.wait(1000); 
                
                }
            } while (usuarioEncontrado == false);
            
            if (!usuarioEncontrado) {
                throw new Error('Usuário não encontrado');
            }
        };

        await verificarTodasPaginas();

    }
}

