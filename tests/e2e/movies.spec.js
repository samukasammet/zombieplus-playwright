const { test, expect } = require('../support')

const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    executeSQL(`DELETE FROM movies`)
})

test('deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    const message = `O filme '${movie.title}' foi adicionado ao catálogo.`
    await page.popup.haveText(message)
})

test('não deve cadastrar um titulo duplicado', async ({ page, request }) => {
    const movie = data.duplicate
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    const message = `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
    await page.popup.haveText(message)
})

test('não deve cadastrar quando os campos obrigratórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.goForm()
    await page.movies.submit()
    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'])
})