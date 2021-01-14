describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Julius Lubys',
            username: 'Julius',
            password: 'mypassword'
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        const userTwo = {
            name: 'Mantas Va',
            username: 'Mantas',
            password: 'password'
        }
        cy.request('POST', 'http://localhost:3001/api/users', userTwo)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('Login')
        cy.contains('username')
        cy.contains('password')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('Julius')
            cy.get('#password').type('mypassword')
            cy.get('#submitbutton').click()
            cy.contains('Julius Lubys logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('John')
            cy.get('#password').type('password')
            cy.get('#submitbutton').click()

            cy.get('.error')
                .should('contain', 'Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'Julius', password: 'mypassword' })
        })

        it('A blog can be created', function() {
            cy.contains('New blog').click()
            cy.get('.titleInput').type('BMW will make an all-electric 5 Series, 7 Series, and X1')
            cy.get('.authorInput').type('Sean Kane')
            cy.get('.urlInput').type('https://www.theverge.com/2020/7/28/21345464/bmw-5-7-series-x1-electric-car-ev-plug-in')
            cy.contains('create').click()
            cy.contains('BMW will make an all-electric 5 Series, 7 Series, and X1 - Sean Kane')
        })

        describe('blog exists', function() {
            beforeEach(function(){
                cy.createBlog({
                    title: 'BMW will make an all-electric 5 Series, 7 Series, and X1',
                    author: 'Sean Kane',
                    url: 'https://www.theverge.com/2020/7/28/21345464/bmw-5-7-series-x1-electric-car-ev-plug-in'
                })
            })
            it('User can like a blog', function() {
                cy.contains('BMW will make an all-electric 5 Series, 7 Series, and X1 - Sean Kane').contains('view').click()
                cy.contains('like').click()

                cy.contains('BMW will make an all-electric 5 Series, 7 Series, and X1 - Sean Kane').contains('view').click()
                cy.get('#blogLikes').contains('1')
            })
        })

        describe('few blogs can exist', function() {
            it('blog can be deleted by creator', function() {
                cy.createBlog({ title: 'First blog', author: 'First author', url: 'firstblog.com' })
                cy.createBlog({ title: 'Second blog', author: 'Second author', url: 'secondblog.com' })
                cy.createBlog({ title: 'Third blog', author: 'Third author', url: 'thirdblog.com' })
                cy.contains('First blog').contains('view').click()
                cy.contains('remove').click()
                cy.contains('Blog removed')
            })

            it('blogs are ordered by likes', function(){
                cy.createBlogWithLikes({ title: 'First blog', author: 'First author', url: 'firstblog.com', likes: 4 })
                cy.createBlogWithLikes({ title: 'Second blog', author: 'Second author', url: 'secondblog.com', likes: 1 })
                cy.createBlogWithLikes({ title: 'Third blog', author: 'Third author', url: 'firstblog.com', likes: 7 })

                cy.get(':nth-child(1) > div').contains('view').click()
                cy.get(':nth-child(2) > div').contains('view').click()
                cy.get(':nth-child(3) > div').contains('view').click()

                // cy.get(':nth-child(1) > div.blogsDiv').get('#blogLikes').contains('7')
                // cy.get(':nth-child(2) > div.blogsDiv').get('#blogLikes').contains('4')
                // cy.get(':nth-child(3) > div.blogsDiv').get('#blogLikes').contains('1')
                // cy.get('#blogLikes').contains('7')
                cy.get('#blogLikes').then( likes => {
                    cy.wrap(likes[1]).contains('7')
                    cy.wrap(likes[2]).contains('4')
                    cy.wrap(likes[3]).contains('1')
                })
            })
        })
    })
})