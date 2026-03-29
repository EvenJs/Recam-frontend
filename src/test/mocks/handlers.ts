import { http, HttpResponse } from 'msw'

const baseUrl = 'http://localhost:5096'

export const handlers = [
  // Auth
  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    if (body.email === 'admin@remp.com' && body.password === 'Admin@123!') {
      return HttpResponse.json({
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          token: 'mock-jwt-token',
          userId: 'user-123',
          email: 'admin@remp.com',
          role: 'PhotographyCompany',
          firstName: 'Admin',
          lastName: 'User',
          expiresAt: '2026-12-31T00:00:00Z',
        },
        errors: null,
      })
    }

    return HttpResponse.json(
      {
        success: false,
        statusCode: 401,
        message: 'Invalid email or password',
        data: null,
        errors: null,
      },
      { status: 401 }
    )
  }),

  // Listings — plain array response
  http.get(`${baseUrl}/listings`, () => {
    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: 'Success',
      data: [
        {
          id: 1,
          title: 'Opera House',
          street: '123 Main St',
          city: 'Sydney',
          state: 'NSW',
          postcode: 2000,
          price: 900000,
          bedrooms: 3,
          bathrooms: 2,
          garages: 1,
          floorArea: 200,
          propertyType: 1,
          saleCategory: 1,
          listcaseStatus: 1,
          createdAt: '2026-03-20T00:00:00Z',
          mediaTypes: [1, 3],
        },
      ],
      errors: null,
    })
  }),

  // Update status — expects plain integer body
  http.patch(`${baseUrl}/listings/:id/status`, async ({ request }) => {
    const body = await request.text()
    const status = JSON.parse(body)

    if (typeof status !== 'number') {
      return HttpResponse.json(
        { success: false, message: 'Invalid status', data: null, errors: null },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: 'Success',
      data: { listcaseStatus: status },
      errors: null,
    })
  }),

  // Assign agent — expects plain JSON string body
  http.post(`${baseUrl}/listings/:id/assign-agent`, async ({ request }) => {
    const body = await request.text()
    const agentId = JSON.parse(body)

    if (typeof agentId !== 'string') {
      return HttpResponse.json(
        { success: false, message: 'Invalid agentId', data: null, errors: null },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: 'Agent assigned successfully',
      data: null,
      errors: null,
    })
  }),

  // Select media — expects plain array body
  http.put(`${baseUrl}/listings/:id/selected-media`, async ({ request }) => {
    const body = await request.json()

    if (!Array.isArray(body)) {
      return HttpResponse.json(
        { success: false, message: 'Invalid mediaIds', data: null, errors: null },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: 'Success',
      data: null,
      errors: null,
    })
  }),

  // Upload media — multipart/form-data
  http.post(`${baseUrl}/listings/:id/media`, async ({ request }) => {
    const contentType = request.headers.get('content-type') ?? ''

    if (!contentType.includes('multipart/form-data')) {
      return HttpResponse.json(
        { success: false, message: 'Invalid content type', data: null, errors: null },
        { status: 415 }
      )
    }

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: 'Success',
      data: [
        {
          id: 1,
          mediaUrl: 'https://example.com/photo.jpg',
          mediaType: 1,
          isHero: false,
          isSelect: false,
          uploadedAt: '2026-03-20T00:00:00Z',
        },
      ],
      errors: null,
    })
  }),
]