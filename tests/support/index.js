const { test: base, expect } = require('@playwright/test')

const { Login } = require('../actions/Login')
const { Toast } = require('../actions/Components')
const { Movies } = require('../actions/Movies')
const { Leads } = require('../actions/Leads')

const test = base.extend({
    page: async ({ page }, use) => {

        const context = page

        context['leads'] = new Leads(page)
        context['login'] = new Login(page)
        context['movies'] = new Movies(page)
        context['toast'] = new Toast(page)

        await use(context)
    }
})
export { test, expect }