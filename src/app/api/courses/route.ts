import { NextRequest, NextResponse } from 'next/server'
import { supabase, getUser } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (level) {
      query = query.eq('level', level)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      courses: data,
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.is_admin) {
      return NextResponse.json(
        { error: 'Only administrators can create courses' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      content,
      price,
      duration_hours,
      level,
      category,
      image_url,
      is_featured,
      is_published,
      instructor_name
    } = body

    // Validate required fields
    if (!title || !slug || !description || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({
        title,
        slug,
        description,
        content,
        price: price || 0,
        duration_hours: duration_hours || 0,
        level: level || 'beginner',
        category,
        image_url,
        is_featured: is_featured || false,
        is_published: is_published || false,
        instructor_name
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Course created successfully',
      course: data
    }, { status: 201 })
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}