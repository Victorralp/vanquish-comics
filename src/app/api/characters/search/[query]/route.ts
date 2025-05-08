import { NextResponse } from 'next/server';
import { searchCharacters } from '@/lib/api/superhero';
import mockCharacters from '@/lib/api/mock-characters';

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  const query = params.query;

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // Decode the query parameter in case it contains special characters
    const decodedQuery = decodeURIComponent(query);
    
    try {
      // Try to search using the API
      const characters = await searchCharacters(decodedQuery);
      return NextResponse.json(characters);
    } catch (apiError) {
      console.error(`API error searching characters for "${query}":`, apiError);
      
      // Fallback to searching mock data
      console.log('Falling back to mock character data for search');
      
      // Filter mock characters based on name or full-name containing the query
      const filteredMockCharacters = mockCharacters.filter(char => 
        char.name.toLowerCase().includes(decodedQuery.toLowerCase()) ||
        char.biography["full-name"].toLowerCase().includes(decodedQuery.toLowerCase())
      );
      
      return NextResponse.json(
        filteredMockCharacters,
        {
          headers: { 'X-Using-Mock-Data': 'true' }
        }
      );
    }
  } catch (error) {
    console.error(`API route error searching characters for "${query}":`, error);
    return NextResponse.json({ error: 'Failed to perform character search' }, { status: 500 });
  }
} 