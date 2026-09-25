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
  })

});