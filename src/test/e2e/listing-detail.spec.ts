import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Listing Detail', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('shows listing details', async ({ page }) => {
    await page.goto('/listings/1')
    await expect(page.getByRole('heading').first()).toBeVisible()
    await expect(page.getByText('Bedrooms')).toBeVisible()
    await expect(page.getByText('Bathrooms')).toBeVisible()
  })

  test('shows Media tab by default', async ({ page }) => {
    await page.goto('/listings/1')
    await expect(page.getByRole('tab', { name: 'Media' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Selection' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Contacts' })).toBeVisible()
  })

  test('shows admin action buttons', async ({ page }) => {
    await page.goto('/listings/1')
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /assign agent/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /delete/i })).toBeVisible()
  })

  test('navigates to edit page', async ({ page }) => {
    await page.goto('/listings/1')
    await page.getByRole('button', { name: /edit/i }).click()
    await expect(page).toHaveURL('/listings/1/edit')
    await expect(page.getByText('Edit Listing')).toBeVisible()
  })

  test('shows delete confirmation dialog', async ({ page }) => {
    await page.goto('/listings/1')
    await page.getByRole('button', { name: /delete/i }).click()
    await expect(page.getByText('Delete listing?')).toBeVisible()
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible()
  })

  test('shows assign agent modal', async ({ page }) => {
    await page.goto('/listings/1')
    await page.getByRole('button', { name: /assign agent/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByPlaceholder('Search by email')).toBeVisible()
  })

  test('switches between tabs', async ({ page }) => {
    await page.goto('/listings/1')
    await page.getByRole('tab', { name: 'Contacts' }).click()
    await expect(page.getByRole('tab', { name: 'Contacts' })).toHaveAttribute('data-state', 'active')
  })
})