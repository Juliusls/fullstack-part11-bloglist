describe('Blog app', function() {
    it('page can be visited', function() {
        cy.visit('http://localhost:3001')
        cy.login({ username: 'Julius', password: 'mypassword' })
        cy.contains('Julius Lubys logged in')
    })
})