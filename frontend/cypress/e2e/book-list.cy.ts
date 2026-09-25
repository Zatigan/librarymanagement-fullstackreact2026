describe('Book list', () => {
  it('should display books returned by the API', () => {
    cy.intercept('GET', 'http://localhost:3000/books', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Dune',
          author: 'Frank Herbert',
          available_copies: 3,
          total_copies: 3,
        },
      ],
    }).as('getBooks');

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.get('.book-item')
      .should('have.length.at.least', 1)
      .and('contain.text', 'Dune');
  });

  it('should allow to add a new book', () => {
    cy.visit('http://localhost:4200/add');

    cy.get('input#title').type('Mon titre');
    cy.get('input#author').type('Mon auteur');
    cy.get('input#copies').type('{selectAll}3');

    cy.intercept('POST', 'http://localhost:3000/books')
      .as('addBook');

    cy.get('form > button[type="submit"]').click();
    cy.wait('@addBook');

    // Option un peu troll et peu pérenne
    // cy.get('td').eq(-5).should('contain', 'Mon titre');

    // Option plus clean mais générale
    // cy.get('tbody').last().should('contain', 'Mon titre');

    // Option clean
    cy.get('tr').last().should('contain', 'Mon titre');
    cy.get('tr').last().should('contain', 'Mon auteur');
  });

  it('should decrease available copies when a book is borrowed', () => {
    let availableCopies = 3;

    cy.intercept('GET', 'http://localhost:3000/books', (req) => {
      req.reply({
        statusCode: 200,
        body: [{
          id: 1,
          title: 'Dune',
          author: 'Frank Herbert',
          available_copies: availableCopies,
          total_copies: 3,
        }]
      });
    }).as('getBooks');

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.intercept('PUT', 'http://localhost:3000/books/1/borrow', (req) => {
      availableCopies--;

      req.reply({
        statusCode: 200,
        body: {},
      });
    }).as('borrowBook');

    // Je vérifie la valeur au chargement
    // Cypress considère Titre comme index 0
    cy.contains('tr', 'Dune').within(() => {
      // ===> Option sans ajouter de balise
      // cy.get('td').eq(2).should('have.text', '3');
      // ===> Option avec une balise custom
      cy.get('[data-cy="available-copies"]').should('have.text', '3');
    })


    cy.contains('tr', 'Dune').within(() => {
      cy.contains('button', 'Borrow').click();
    });

    cy.wait('@borrowBook');

    // Je vérifie la valeur à la mise à jour
    cy.contains('tr', 'Dune').within(() => {
      // ===> Option sans ajouter de balise
      // cy.get('td').eq(2).should('have.text', '2');
      // ===> Option avec une balise
      cy.get('[data-cy="available-copies"]').should('contain', 2);
    });

  });
});