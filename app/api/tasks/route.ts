export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user");
    console.log("Received user ID:", userId);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    let { title, description, user, status = 'todo' } = body;
    console.log('Received task data:', body);

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

  if (user && typeof user === 'string') {
  user = new mongoose.Types.ObjectId(user);
 
  }

    const task = await Task.create({
      title: title,
      description: description || '',
      status,
      user,
    });
    console.log('Created task:', task);
    return NextResponse.json(
      { success: true, data: task },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}