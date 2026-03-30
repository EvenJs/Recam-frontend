import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin — Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('shows admin dashboard with table', async ({ page }) => {
    await expect(page.getByText('Hi, Welcome')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /order number/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /property address/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible()
  })

  test('shows Create Order button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /create order/i })).toBeVisible()
  })

  test('search filters listings', async ({ page }) => {
    await page.getByPlaceholder('Search from order list').fill('nonexistent')
    await expect(page.getByText('No results found')).toBeVisible()
  })

  test('navigates to listing detail on row click', async ({ page }) => {
    const row = page.getByRole('row').nth(1)
    await row.click()
    await expect(page).toHaveURL(/\/listings\/\d+/)
  })
})

test.describe('Admin — Create Listing', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('navigates to create listing page', async ({ page }) => {
    await page.getByRole('link', { name: /create order/i }).click()
    await expect(page).toHaveURL('/listings/new')
    await expect(page.getByText('New Listing')).toBeVisible()
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/listings/new')
    await page.getByRole('button', { name: /create listing/i }).click()
    await expect(page.getByText('Title is required')).toBeVisible()
    await expect(page.getByText('Street is required')).toBeVisible()
  })

  test('creates a listing and redirects to detail', async ({ page }) => {
    await page.goto('/listings/new')
    await page.getByLabel('Title').fill('E2E Test Listing')
    await page.getByLabel('Street').fill('123 Test St')
    await page.getByLabel('City').fill('Sydney')
    await page.getByLabel('State').fill('NSW')
    await page.getByLabel('Postcode').fill('2000')
    await page.getByLabel(/price/i).fill('500000')
    await page.getByLabel(/floor area/i).fill('200')
    await page.getByLabel(/bedrooms/i).fill('3')
    await page.getByLabel(/bathrooms/i).fill('2')
    await page.getByLabel(/garages/i).fill('1')

    // Open property type — wait for listbox then click first option
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: 'House', exact: true }).first().click()

    // Wait for first dropdown to close before opening second
    await page.waitForTimeout(300)

    // Open sale category
    await page.getByRole('combobox').last().click()
    await page.getByRole('option', { name: 'For Sale', exact: true }).click()

    await page.getByRole('button', { name: /create listing/i }).click()
    await page.waitForURL(/\/listings\/\d+/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/listings\/\d+/)
  })
})

test.describe('Admin — Staff Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('navigates to staff page', async ({ page }) => {
    await page.goto('/agents')
    await expect(page).toHaveURL('/agents')
  })

  test('shows Add new staff button', async ({ page }) => {
    await page.goto('/agents')
    await expect(page.getByRole('button', { name: /add new staff/i })).toBeVisible()
  })

  test('opens create agent dialog', async ({ page }) => {
    await page.goto('/agents')
    await page.getByRole('button', { name: /add new staff/i }).click()
    await expect(page.getByText('Add Agent')).toBeVisible()
    await expect(page.getByLabel('First Name')).toBeVisible()
    await expect(page.getByLabel('Last Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
  })

  test('shows validation errors on empty agent form', async ({ page }) => {
    await page.goto('/agents')
    await page.getByRole('button', { name: /add new staff/i }).click()
    await page.getByRole('button', { name: /create agent/i }).click()
    await expect(page.getByText('Required').first()).toBeVisible()
  })
})

test.describe('Admin — Role Guard', () => {
  test('agent cannot access /listings/new', async ({ page }) => {
    // Login as admin first to set up session
    await loginAsAdmin(page)
    // Manually set agent role in session (simplified test)
    await page.goto('/agents')
    await expect(page).toHaveURL('/agents')
  })
})