/// <reference types="cypress" />

const url = 'https://crudemon.herokuapp.com';
describe('Basic functionalities', () => {
    beforeEach(() => {
        cy.viewport(1600, 900);
        cy.visit(url);
    });

    it('When the user enters the page, a loading message should be shown UNTIL the full Pokémon list is being rendered.', () => {
        cy.get("[data-testid='loading-message']").should('exist');
        cy.then(() => {
            cy.get("[data-testid='loading-message']").should('not.exist');
        });
    });

    it('When the user clicks the New button and the Cancel button, the Pokémon form should appear and disappear as the user clicks on it.', () => {
        // Testing the New button
        cy.get("[data-testid='new-btn']").click();
        cy.get("[data-testid='pokemon-form'").should('exist');
        cy.get("[data-testid='new-btn']").click();
        cy.get("[data-testid='pokemon-form'").should('not.exist');

        // Testing the Cancel button
        cy.get("[data-testid='new-btn']").click();
        cy.get("[data-testid='cancel-btn']").click();
        cy.get("[data-testid='pokemon-form'").should('not.exist');
    });

    it('When the user tries to create a new Pokémon and some input is missing, an error message should be shown, and the incompleted Pokémon should NOT be added to the Pokémon list.', () => {
        cy.get("[data-testid='pokemon-list']", { timeout: 10 * 1000 }).should('be.visible');
        cy.get("[data-testid='new-btn']").click();
        cy.get("[data-testid='save-btn']").click();
        cy.get("[data-testid='error-message']").should('exist');
    });
});

describe('Perform all the CRUD testings', () => {
    beforeEach(() => {
        cy.viewport(1600, 900);
        cy.visit(url);
        cy.get("[data-testid='pokemon-list']", { timeout: 10 * 1000 }).should('be.visible');
    });

    /* Generates a random number between 0 and 1 with a precision of 6 decimals */
    const prevRandomNumber = Math.random().toFixed(6);
    const newRandomNumber = Math.random().toFixed(6);

    it('CREATE', () => {
        cy.get("[data-testid='new-btn']").click();
        cy.get("[data-testid='pokemon-name']").type(`Pikachu ${prevRandomNumber}`);
        cy.get("[data-testid='pokemon-image']").type(
            'https://areajugones.sport.es/wp-content/uploads/2021/06/pikachu-pokemon.jpeg'
        );
        cy.get("[data-testid='save-btn']").click();
        cy.get("[data-testid='tbody'] > tr", { timeout: 10 * 1000 })
            .last()
            .find('td')
            .first()
            .should('not.have.value', `Pikachu ${prevRandomNumber}`);
    });

    it('READ', () => {
        cy.get("[data-testid='new-btn']").click();
        cy.get("[data-testid='pokemon-name']").type(`Pikachu ${newRandomNumber}`);
        cy.get("[data-testid='pokemon-image']").type(
            'https://areajugones.sport.es/wp-content/uploads/2021/06/pikachu-pokemon.jpeg'
        );
        cy.get("[data-testid='save-btn']").click();

        cy.get("[data-testid='search-bar']").type('Pikachu{enter}');
        cy.get("[data-testid='tbody'] > tr").last().find('td').first().contains(`Pikachu ${prevRandomNumber}`);
    });

    it('UPDATE', () => {
        cy.get("[data-testid='tbody'] > tr").first().find('td').last().find('img').first().click();
        cy.get("[data-testid='pokemon-name'").clear().type('Lucario');
        cy.get("[data-testid='save-btn']").click();
        cy.get("[data-testid='tbody'] > tr").first().find('td').first().contains('Lucario');
    });

    it('REMOVE', () => {
        cy.get("[data-testid='tbody'] > tr").last().find('td').last().find('img').last().click();
        cy.get("[data-testid='tbody'] > tr")
            .last()
            .find('td')
            .first()
            .should('not.have.value', `Pikachu ${newRandomNumber}`);
    });
});
