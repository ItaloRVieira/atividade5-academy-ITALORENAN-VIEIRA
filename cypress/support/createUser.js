export default class createUser {
    inputName = '#name';
    inputEmail = '#email';
    buttSave = '[type="submit"]';
    buttomBack = 'a[href="/users"]';

    typeName(nome){
        cy.get(this.inputName).type(nome)
    };

    typeEmail(email){
        cy.get(this.inputEmail).type(email)
    };

    buttomSave(){
        cy.get(this.buttSave).click()
    };

    getBack(){
        cy.get(this.buttomBack).click()
    };
}