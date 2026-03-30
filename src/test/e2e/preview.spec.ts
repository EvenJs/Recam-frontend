import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Preview Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('shows preview page with topbar', async ({ page }) => {
    await page.goto('/listings/1/preview')
    await expect(page.getByRole('button', { name: /download files/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /publish/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /exit/i })).toBeVisible()
  })

  test('shows property sections', async ({ page }) => {
    await page.goto('/listings/1/preview')
    await expect(page.getByRole('heading', { name: 'Property Description' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible({ timeout: 10000 })
  })

  test('exit navigates back to listing detail', async ({ page }) => {
    await page.goto('/listings/1/preview')
    await page.getByRole('button', { name: /exit/i }).click()
    await expect(page).toHaveURL('/listings/1')
  })

  test('shows no sidebar', async ({ page }) => {
    await page.goto('/listings/1/preview')
    await expect(page.getByRole('navigation')).not.toBeVisible()
  })
})

test.describe('Public Preview Page', () => {
  test('accessible without login', async ({ page }) => {
    await page.goto('/p/test-token')
    // Should not redirect to login
    await expect(page).not.toHaveURL('/login')
  })
})