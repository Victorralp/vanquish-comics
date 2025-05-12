import { NextRequest, NextResponse } from 'next/server';
import mockComics from '@/lib/api/mock-comics';

// API base URL
const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.NEXT_PUBLIC_COMICVINE_API_KEY || '';

/**
 * API route for fetching a specific comic by ID
 * GET /api/comics/[id]
 */
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly resolved before using it
    const { id: idString } = params;
    const id = parseInt(idString, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid comic ID' }, { status: 400 });
    }
    
    // Use mock data in development if no API key
    if (process.env.NODE_ENV === 'development' && !API_KEY) {
      console.log('Using mock comics data in development mode (no API key)');
      const comic = mockComics.find(c => c.id === id);
      
      if (!comic) {
        return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
      }
      
      return NextResponse.json(comic);
    }
    
    // Build the API URL with parameters
    const apiUrl = `${API_BASE_URL}/issue/4000-${id}?api_key=${API_KEY}&format=json&field_list=id,volume,issue_number,name,image,date_added,description,cover_date,person_credits,character_credits`;
    
    // Make the request to the ComicVine API
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add cache settings
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const comic = data.results;
    
    // Transform API response to match our Comic interface
    const transformedComic = {
      id: comic.id,
      title: comic.volume?.name || comic.name || 'Unknown Title',
      issueNumber: comic.issue_number || undefined,
      description: comic.description || 'No description available',
      coverImageUrl: comic.image?.medium_url || 'https://placehold.co/400x600/111827/ffffff?text=No+Cover',
      releaseDate: comic.cover_date || undefined,
      creators: {
        writer: comic.person_credits?.filter((p: any) => p.role === 'writer').map((p: any) => p.name) || [],
        artist: comic.person_credits?.filter((p: any) => p.role === 'artist').map((p: any) => p.name) || [],
        coverArtist: comic.person_credits?.filter((p: any) => p.role === 'cover').map((p: any) => p.name) || [],
      },
      featuredCharacters: comic.character_credits?.map((c: any) => ({ id: c.id, name: c.name })) || [],
    };
    
    return NextResponse.json(transformedComic);
  } catch (error: any) {
    console.error('Error fetching comic by ID from API:', error);
    
    // Fallback to mock data on error
    const { id: idString } = params;
    const id = parseInt(idString, 10);
    const comic = mockComics.find(c => c.id === id);
    
    if (!comic) {
      return NextResponse.json({ error: 'Comic not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      comic, 
      { 
        status: 200,
        headers: { 'X-Fallback': 'true', 'X-Error': error.message }
      }
    );
  }
} 