const { test, expect } = require('../support')
const data = require('../support/fixtures/tvShows.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    executeSQL(`DELETE FROM tvshows`)
})

test('deve poder cadastrar uma nova série', async ({ page }) => {
    const tvShow = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvShows.create(tvShow)
    const message = `A série '${tvShow.title}' foi adicionada ao catálogo.`
    await page.popup.haveText(message)
})
test('deve poder remover uma série', async ({ page, request }) => {
    const tvShow = data.remove
    await request.api.postTvShow(tvShow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvShows.goTvShows()
    await page.tvShows.remove(tvShow)
    await page.popup.haveText('Série removida com sucesso.')
})
test('não deve cadastrar um titulo duplicado', async ({ page, request }) => {
    const tvShow = data.duplicate
    await request.api.postTvShow(tvShow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvShows.create(tvShow)
    const message = `O título '${tvShow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
    await page.popup.haveText(message)
})
test('não deve cadastrar quando os campos obrigratórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvShows.goTvShows()
    await page.tvShows.goForm()
    await page.tvShows.submit()
    await page.tvShows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'])
})
test('deve buscar pelo termo zumbi', async ({ page, request }) => {
    const tvShow = data.to_search
    tvShow.data.forEach(async (m) => {
        await request.api.postTvShow(m)
    })
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvShows.goTvShows()
    await page.tvShows.search(tvShow.input)
    await page.tvShows.tableHave(tvShow.outputs)

})