import { NextRequest, NextResponse } from 'next/server';
import mockComics from '@/lib/api/mock-comics';
import * as comicBooksAPI from '@/lib/api/comic-books-api';

// API base URL
const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.NEXT_PUBLIC_COMICVINE_API_KEY || '';

/**
 * API route for searching comics
 * GET /api/comics/search?query=batman&limit=10
 * GET /api/comics/search?query=batman&noLimit=true for unlimited results
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const noLimit = searchParams.get('noLimit') === 'true';
    const limitParam = searchParams.get('limit');
    const limit = noLimit ? undefined : (limitParam ? parseInt(limitParam, 10) : undefined);
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }
    
    console.log(`API search route: Query="${query}", noLimit=${noLimit}, limit=${limit}`);
    
    // Check if we're using the new API (default to true)
    const useNewAPI = searchParams.get('useOldAPI') !== 'true';
    
    if (useNewAPI) {
      console.log('Using new comicbooks-api for search');
      
      try {
        // The comicbooks-api uses page number, we'll use 1 by default since it gets all results
        const pageNumber = 1;
        
        // Use the comicbooks-api search function
        const comics = await comicBooksAPI.searchComics(query, pageNumber);
        
        console.log(`Returning ${comics.length} comics from comicbooks-api search`);
        
        // Apply limit if needed (though the API should handle this)
        const results = (!noLimit && limit) ? comics.slice(0, limit) : comics;
        
        return NextResponse.json(results);
      } catch (apiError) {
        console.error('Error using comicbooks-api for search:', apiError);
        console.log('Falling back to mock data for search');
        
        // If comicbooks-api fails, fall back to mock data
        const filteredComics = mockComics.filter(comic => 
          comic.title.toLowerCase().includes(query.toLowerCase()) ||
          (comic.description && comic.description.toLowerCase().includes(query.toLowerCase()))
        );
        
        // Apply limit only if specified and noLimit is false
        const results = (!noLimit && limit) ? filteredComics.slice(0, limit) : filteredComics;
        
        return NextResponse.json(results, { 
          headers: { 'X-Fallback': 'true', 'X-Error': apiError.message }
        });
      }
    }
    
    // Legacy API mode
    console.log('Using mock data for search');
    
    const filteredComics = mockComics.filter(comic => 
      comic.title.toLowerCase().includes(query.toLowerCase()) ||
      (comic.description && comic.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Apply limit only if specified and noLimit is false
    const results = (!noLimit && limit) ? filteredComics.slice(0, limit) : filteredComics;
    console.log(`Returning ${results.length} mock results for query "${query}"`);
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error searching comics from API:', error);
    
    // Fallback to mock data on error
    const query = request.nextUrl.searchParams.get('query') || '';
    const noLimit = request.nextUrl.searchParams.get('noLimit') === 'true';
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = noLimit ? undefined : (limitParam ? parseInt(limitParam, 10) : undefined);
    
    const filteredComics = mockComics.filter(comic => 
      comic.title.toLowerCase().includes(query.toLowerCase()) ||
      (comic.description && comic.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Apply limit only if specified and noLimit is false
    const results = (!noLimit && limit) ? filteredComics.slice(0, limit) : filteredComics;
    console.log(`Error fallback: Returning ${results.length} mock results for query "${query}"`);
    
    return NextResponse.json(
      results, 
      { 
        status: 200,
        headers: { 'X-Fallback': 'true', 'X-Error': error.message }
      }
    );
  }
} 