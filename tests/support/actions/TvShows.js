const { expect } = require('@playwright/test')

export class TvShows {
    constructor(page) {
        this.page = page
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click()
    }
    async goTvShows() {
        await this.page.locator('a[href$="tvshows"]').click()
    }
    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }
    async create(tvShow) {
        await this.goTvShows()
        await this.goForm()
        await this.page.getByLabel('Titulo da série').fill(tvShow.title)
        await this.page.getByLabel('Sinopse').fill(tvShow.overview)
        await this.page.locator('#select_company_id .react-select__indicator')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvShow.company })
            .click()
        await this.page.locator('#select_year .react-select__indicator')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvShow.release_year })
            .click()
        await this.page.locator('input[name=seasons]').fill(tvShow.seasons.toString())
        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures/' + tvShow.cover)
        if (tvShow.featured) {
            await this.page.locator('.featured .react-switch').click()
        }
        await this.submit()
    }
    async remove(tvShow) {
        await this.page.getByRole('row', { name: tvShow.title }).getByRole('button').click()
        await this.page.getByText('aqui').click()
    }
    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }
    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(target)
        await this.page.click('.actions button')
    }
    async tableHave(content) {
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }
}