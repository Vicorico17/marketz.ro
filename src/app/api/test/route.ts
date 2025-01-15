import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'

export async function GET() {
  console.log('TEST API - Starting...');
  try {
    console.log('Connecting to MongoDB...');
    const conn = await connectDB();
    console.log('Connected to MongoDB, connection state:', conn.connection.readyState);
    
    // Test database operations
    const testFight = await Fight.create({
      fighter1: 'Test Fighter 1',
      fighter2: 'Test Fighter 2',
      date: new Date(),
      category: 'Test Category',
      predictions: new Map()
    });
    console.log('Test fight created:', testFight);

    // Verify the fight was saved
    const savedFight = await Fight.findById(testFight._id);
    console.log('Test fight retrieved:', savedFight);

    // Get all fights
    const allFights = await Fight.find({});
    console.log('All fights:', allFights);

    return NextResponse.json({
      success: true,
      testFight,
      savedFight,
      allFights,
      connectionState: conn.connection.readyState
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 