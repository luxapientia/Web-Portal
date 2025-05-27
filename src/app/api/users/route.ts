import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/services/userService'
import { validateRequest } from '@/lib/validate'
import { registerUserSchema, userResponseSchema } from '@/schemas/user.schema'

const userService = new UserService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const user = await userService.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate response data
    const validatedUser = userResponseSchema.parse(user)
    return NextResponse.json(validatedUser)
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, registerUserSchema)
    if (!validation.success) {
      return validation.error
    }

    const { name, email, password } = validation.data

    const existingUser = await userService.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    const user = await userService.create({ name, email, password })
    
    // Validate response data
    const validatedUser = userResponseSchema.parse(user)
    return NextResponse.json(validatedUser, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/users:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 