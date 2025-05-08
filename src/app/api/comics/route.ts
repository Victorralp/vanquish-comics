import { NextRequest, NextResponse } from 'next/server';
import mockComics from '@/lib/api/mock-comics';
import * as comicBooksAPI from '@/lib/api/comic-books-api';

/**
 * API route for fetching comics
 * GET /api/comics?limit=12&offset=0
 * GET /api/comics?noLimit=true to get all comics
 * GET /api/comics?publisher=marvel to get comics from a specific publisher
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const noLimit = searchParams.get('noLimit') === 'true';
    const limitParam = searchParams.get('limit');
    const limit = noLimit ? undefined : (limitParam ? parseInt(limitParam, 10) : 12);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const publisher = searchParams.get('publisher') || '';
    
    // Calculate page number from offset and limit for the comicbooks-api
    // comicbooks-api uses page numbers instead of offset/limit
    const pageNumber = limit ? Math.floor(offset / limit) + 1 : 1;
    
    // Check if we're using the new API (default to true)
    const useNewAPI = searchParams.get('useOldAPI') !== 'true';
    
    if (useNewAPI) {
      console.log('Using new comicbooks-api');
      
      try {
        let comics;
        
        // If publisher is specified, use the publisher-specific function
        if (publisher) {
          comics = await comicBooksAPI.getComicsByPublisher(publisher, pageNumber);
        } else {
          // Otherwise get latest comics
          comics = await comicBooksAPI.getLatestComics(pageNumber);
        }
        
        console.log(`Returning ${comics.length} comics from comicbooks-api`);
        return NextResponse.json(comics);
      } catch (apiError) {
        console.error('Error using comicbooks-api:', apiError);
        console.log('Falling back to mock data');
        
        // If comicbooks-api fails, fall back to mock data
        if (noLimit || isNaN(limit as number)) {
          return NextResponse.json(mockComics);
        }
        
        return NextResponse.json(
          mockComics.slice(offset, offset + (limit as number)),
          { headers: { 'X-Fallback': 'true', 'X-Error': apiError.message } }
        );
      }
    }
    
    // Legacy API mode
    console.log('Using legacy mock data');
    
    // Return all comics for counting if no limit specified
    if (noLimit || isNaN(limit as number)) {
      console.log('Returning all comics (no limit)');
      return NextResponse.json(mockComics);
    }
    
    // Otherwise return paginated result
    console.log(`Returning paginated comics: offset=${offset}, limit=${limit}`);
    return NextResponse.json(mockComics.slice(offset, offset + (limit as number)));
  } catch (error: any) {
    console.error('Error fetching comics from API:', error);
    
    // Fallback to mock data on error
    const searchParams = request.nextUrl.searchParams;
    const noLimit = searchParams.get('noLimit') === 'true';
    const limitParam = searchParams.get('limit');
    const limit = noLimit ? undefined : (limitParam ? parseInt(limitParam, 10) : 12);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    if (noLimit || isNaN(limit as number)) {
      console.log('Error fallback: Returning all comics (no limit)');
      return NextResponse.json(mockComics);
    }
    
    console.log(`Error fallback: Returning paginated comics (offset=${offset}, limit=${limit})`);
    return NextResponse.json(
      mockComics.slice(offset, offset + (limit as number)),
      { 
        status: 200,
        headers: { 'X-Fallback': 'true', 'X-Error': error.message }
      }
    );
  }
} 