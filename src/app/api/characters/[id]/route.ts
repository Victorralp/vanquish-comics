import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import mockCharacters from '@/lib/api/mock-characters';
import { getCharacterById } from '@/lib/api/superhero'; // Import the *actual* API fetching function

// Fixed type definition properly for Next.js 15.3.1
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // Extract the id properly
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Character ID is required' }, { status: 400 });
  }

  try {
    // Try to fetch the character from the API first
    console.log(`API route: Fetching character with id ${id}`);
    
    // Build the API URL for the ComicVine API
    const API_BASE_URL = 'https://comicvine.gamespot.com/api';
    const API_KEY = process.env.NEXT_PUBLIC_COMICVINE_API_KEY || '255ac561030f2120b547ebbbb3132d5f012127ef';
    
    const apiUrl = `${API_BASE_URL}/character/4005-${id}/?api_key=${API_KEY}&format=json&field_list=id,name,image,deck,description,publisher,powers,gender,origin,real_name,aliases`;
    
    console.log(`Calling ComicVine API: ${apiUrl.replace(API_KEY, '[API_KEY]')}`);
    
    try {
      const response = await fetch(apiUrl, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store' // Disable caching for debugging
      });
      
      if (!response.ok) {
        throw new Error(`ComicVine API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status_code === 1 && data.results) {
        // Map ComicVine API result to our Character type
        const apiCharacter = {
          id: data.results.id.toString(),
          name: data.results.name || 'Unknown',
          powerstats: {
            intelligence: data.results.powers?.intelligence || "50",
            strength: data.results.powers?.strength || "50", 
            speed: data.results.powers?.speed || "50",
            durability: data.results.powers?.durability || "50",
            power: data.results.powers?.power || "50",
            combat: data.results.powers?.combat || "50"
          },
          biography: {
            "full-name": data.results.real_name || data.results.name || 'Unknown',
            "alter-egos": data.results.aliases || 'No alter egos found.',
            aliases: data.results.aliases ? [data.results.aliases] : ["No aliases"],
            "place-of-birth": data.results.origin?.place_of_birth || 'Unknown',
            "first-appearance": 'Unknown',
            publisher: data.results.publisher?.name || 'Unknown',
            alignment: 'good' // Default alignment
          },
          appearance: {
            gender: data.results.gender === 1 ? "Male" : data.results.gender === 2 ? "Female" : "Other",
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
            url: data.results.image?.medium_url || 'https://placehold.co/400x600/111827/ffffff?text=No+Image'
          }
        };
        
        return NextResponse.json(apiCharacter);
      } else {
        throw new Error('Character not found in ComicVine API');
      }
    } catch (apiError) {
      console.error(`Error with ComicVine API for character ${id}:`, apiError);
      console.log('Falling back to mock data for character details');
      
      // Fallback to mock data
      const mockCharacter = mockCharacters.find(char => char.id === id);
      
      if (!mockCharacter) {
        return NextResponse.json({ error: 'Character not found' }, { status: 404 });
      }
      
      return NextResponse.json(mockCharacter, {
        headers: { 'X-Using-Mock-Data': 'true' }
      });
    }
  } catch (error) {
    console.error(`API route error fetching character ${id}:`, error);
    // Don't expose detailed error messages to the client
    return NextResponse.json({ error: 'Failed to fetch character data' }, { status: 500 });
  }
} 