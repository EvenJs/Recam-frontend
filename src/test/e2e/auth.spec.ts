import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Enter a valid email')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@remp.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Invalid email or password')).toBeVisible()
  })

  test('logs in as admin and redirects to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@remp.com')
    await page.getByLabel('Password').fill('Admin@123!')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Hi, Welcome')).toBeVisible()
  })

  test('logout redirects to login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@remp.com')
    await page.getByLabel('Password').fill('Admin@123!')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('/dashboard')

    // Target logout button by its ref in header — first button in header
    await page.locator('header button:visible').first().click()
    await expect(page).toHaveURL('/login')
  })

  test('redirects to dashboard if already logged in', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@remp.com')
    await page.getByLabel('Password').fill('Admin@123!')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('/dashboard')
    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })
})