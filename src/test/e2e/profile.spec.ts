import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('shows profile settings page', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText('Profile Settings')).toBeVisible()
    await expect(page.getByText('Change Photo')).toBeVisible()
  })

  test('shows email as readonly', async ({ page }) => {
    await page.goto('/profile')
    const emailInput = page.locator('input[value="admin@remp.com"]')
    await expect(emailInput).toHaveAttribute('readonly')
  })

  test('shows change password section', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText('Change Password')).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible()
    await expect(page.locator('input[type="password"]').nth(2)).toBeVisible()
  })

  test('shows password mismatch error', async ({ page }) => {
    await page.goto('/profile')
    await page.locator('input[type="password"]').first().fill('Admin@123!')
    await page.locator('input[type="password"]').nth(1).fill('NewPass@123!')
    await page.locator('input[type="password"]').nth(2).fill('DifferentPass@123!')
    await page.getByRole('button', { name: /update password/i }).click()
    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })
})