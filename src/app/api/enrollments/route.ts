import { NextRequest, NextResponse } from 'next/server'
import { supabase, getUser } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          slug,
          description,
          category,
          level,
          duration_hours,
          image_url
        )
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ enrollments: data })
  } catch (error) {
    console.error('Enrollments fetch error:', error)
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

    const { course_id } = await request.json()

    if (!course_id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Check if course exists and is published
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id, is_published')
      .eq('id', course_id)
      .single()

    if (courseError || !courseData?.is_published) {
      return NextResponse.json(
        { error: 'Course not found or not available' },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id,
        status: 'enrolled',
        progress_percentage: 0
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
      message: 'Enrolled successfully',
      enrollment: data
    }, { status: 201 })
  } catch (error) {
    console.error('Enrollment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { enrollment_id, progress_percentage, status } = await request.json()

    if (!enrollment_id) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (progress_percentage !== undefined) {
      updateData.progress_percentage = Math.min(100, Math.max(0, progress_percentage))
    }

    if (status) {
      updateData.status = status
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .update(updateData)
      .eq('id', enrollment_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Enrollment updated successfully',
      enrollment: data
    })
  } catch (error) {
    console.error('Enrollment update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}