import { NextResponse, NextRequest } from 'next/server';
import mockCharacters from '@/lib/api/mock-characters'; // Import mock character data for fallback

// API base URL for ComicVine
const API_BASE_URL = 'https://comicvine.gamespot.com/api';
const API_KEY = process.env.NEXT_PUBLIC_COMICVINE_API_KEY || '255ac561030f2120b547ebbbb3132d5f012127ef';

/**
 * API route for fetching all characters with pagination
 * GET /api/characters?limit=12&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    
    console.log(`API route: Fetching characters with limit=${limit}, offset=${offset}, sortBy=${sortBy}, sortDirection=${sortDirection}`);
    
    try {
      // Use ComicVine API for fetching characters
      console.log(`Using ComicVine API with key: ${API_KEY.substring(0, 4)}...`);
      
      // In ComicVine, we can directly fetch a list of characters with pagination
      const apiLimit = 100; // Reasonable limit for ComicVine API
      const apiOffset = offset;
      
      // Build the API URL with parameters
      const apiUrl = `${API_BASE_URL}/characters?api_key=${API_KEY}&format=json&limit=${apiLimit}&offset=${apiOffset}&field_list=id,name,image,deck,description,publisher,powers,gender,origin,real_name,aliases`;
      
      console.log(`Calling ComicVine API: ${apiUrl.replace(API_KEY, '[API_KEY]')}`);
      
      // For debugging: Test the API connection
      try {
        const response = await fetch(apiUrl, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store' // Disable caching for debugging
        });
        
        console.log(`API response status: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`ComicVine API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`API response success: ${data.status_code === 1}`);
        console.log(`API found ${data.results?.length || 0} characters`);
        
        if (data.status_code === 1 && data.results && data.results.length > 0) {
          // Map ComicVine API results to our Character type
          const apiCharacters = data.results.map((char: any) => ({
            id: char.id.toString(),
            name: char.name || 'Unknown',
            powerstats: {
              intelligence: char.powers?.intelligence || "50",
              strength: char.powers?.strength || "50", 
              speed: char.powers?.speed || "50",
              durability: char.powers?.durability || "50",
              power: char.powers?.power || "50",
              combat: char.powers?.combat || "50"
            },
            biography: {
              "full-name": char.real_name || char.name || 'Unknown',
              "alter-egos": char.aliases || 'No alter egos found.',
              aliases: char.aliases ? [char.aliases] : ["No aliases"],
              "place-of-birth": char.origin?.place_of_birth || 'Unknown',
              "first-appearance": 'Unknown',
              publisher: char.publisher?.name || 'Unknown',
              alignment: 'good' // Default alignment
            },
            appearance: {
              gender: char.gender === 1 ? "Male" : char.gender === 2 ? "Female" : "Other",
              race: 'Unknown',
              height: ["Unknown"],
              weight: ["Unknown"],
              "eye-color": 'Unknown',
              "hair-color": 'Unknown'
            },
            work: {
              occupation: 'Unknown',
              base: 'Unknown'
            },
            connections: {
              "group-affiliation": 'Unknown',
              relatives: 'Unknown'
            },
            image: {
              url: char.image?.medium_url || 'https://placehold.co/400x600/111827/ffffff?text=No+Image'
            }
          }));
          
          // Sort the characters
          apiCharacters.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
              case 'power':
                valueA = parseInt(a.powerstats.power || '0');
                valueB = parseInt(b.powerstats.power || '0');
                break;
              case 'intelligence':
                valueA = parseInt(a.powerstats.intelligence || '0');
                valueB = parseInt(b.powerstats.intelligence || '0');
                break;
              case 'publisher':
                valueA = a.biography.publisher || '';
                valueB = b.biography.publisher || '';
                return sortDirection === 'asc' 
                  ? valueA.localeCompare(valueB)
                  : valueB.localeCompare(valueA);
              case 'alignment':
                valueA = a.biography.alignment || '';
                valueB = b.biography.alignment || '';
                return sortDirection === 'asc' 
                  ? valueA.localeCompare(valueB)
                  : valueB.localeCompare(valueA);
              case 'name':
              default:
                valueA = a.name;
                valueB = b.name;
                return sortDirection === 'asc' 
                  ? valueA.localeCompare(valueB)
                  : valueB.localeCompare(valueA);
            }
            
            // For numeric comparisons
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
          });
          
          // Client-side pagination if needed
          const paginatedResults = limit
            ? apiCharacters.slice(0, limit)
            : apiCharacters;
          
          console.log(`API route: Returning ${paginatedResults.length} characters from ComicVine API`);
          
          return NextResponse.json(paginatedResults);
        } else {
          throw new Error('No characters found from ComicVine API');
        }
      } catch (testError) {
        console.error('Error with ComicVine API:', testError);
        throw new Error('API connection failed');
      }
    } catch (apiError) {
      console.error('Error fetching from ComicVine API:', apiError);
      console.log('Falling back to mock data');
      
      // Sort the mock characters
      console.log(`Using ${mockCharacters.length} mock characters instead`);
      
      const sortedCharacters = [...mockCharacters].sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
          case 'power':
            valueA = parseInt(a.powerstats.power || '0');
            valueB = parseInt(b.powerstats.power || '0');
            break;
          case 'intelligence':
            valueA = parseInt(a.powerstats.intelligence || '0');
            valueB = parseInt(b.powerstats.intelligence || '0');
            break;
          case 'publisher':
            valueA = a.biography.publisher || '';
            valueB = b.biography.publisher || '';
            return sortDirection === 'asc' 
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          case 'alignment':
            valueA = a.biography.alignment || '';
            valueB = b.biography.alignment || '';
            return sortDirection === 'asc' 
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          case 'name':
          default:
            valueA = a.name;
            valueB = b.name;
            return sortDirection === 'asc' 
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
        }
        
        // For numeric comparisons
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      });
      
      // Paginate the results if limit is specified
      const result = limit !== undefined
        ? sortedCharacters.slice(offset, offset + limit)
        : sortedCharacters.slice(offset);
      
      console.log(`API route: Returning ${result.length} characters from mock data`);
      
      return NextResponse.json(result, {
        headers: { 'X-Using-Mock-Data': 'true' }
      });
    }
  } catch (error) {
    console.error('API route error fetching all characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character list. Please try again later.' }, 
      { status: 500 }
    );
  }
} 