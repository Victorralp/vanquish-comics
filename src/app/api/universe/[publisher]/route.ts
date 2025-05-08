import { NextRequest, NextResponse } from 'next/server';
import mockCharacters from '@/lib/api/mock-characters';

// Publisher mapping
const publisherMap: { [key: string]: string } = {
  marvel: 'Marvel Comics',
  dc: 'DC Comics',
  // Add other publishers here if needed
};

/**
 * API route for fetching characters by publisher
 * GET /api/universe/[publisher]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { publisher: string } }
) {
  try {
    const publisher = params.publisher;
    
    if (!publisher || !publisherMap[publisher]) {
      return NextResponse.json({ error: 'Invalid publisher' }, { status: 400 });
    }
    
    const publisherName = publisherMap[publisher];
    
    // Filter mock characters by publisher
    const filteredCharacters = mockCharacters.filter(
      char => char.biography.publisher === publisherName
    );
    
    return NextResponse.json(filteredCharacters);
  } catch (error) {
    console.error(`API route error fetching ${params.publisher} characters:`, error);
    return NextResponse.json({ error: 'Failed to fetch publisher characters' }, { status: 500 });
  }
} 