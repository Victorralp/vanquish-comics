// Fetch data from the server-side API route
import mockCharacters from './mock-characters';

// Reuse the existing Character interface - it matches the API structure closely
export interface Character {
  id: string; // API uses string IDs
  name: string;
  powerstats: {
    intelligence: string | null;
    strength: string | null;
    speed: string | null;
    durability: string | null;
    power: string | null;
    combat: string | null;
  };
  biography: {
    'full-name': string;
    'alter-egos': string;
    aliases: string[];
    'place-of-birth': string;
    'first-appearance': string;
    publisher: string;
    alignment: string;
  };
  appearance: {
    gender: string;
    race: string | null;
    height: string[];
    weight: string[];
    'eye-color': string;
    'hair-color': string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    'group-affiliation': string;
    relatives: string;
  };
  image: {
    url: string;
  };
}

// Simulate network delay for potential fallback to mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add sorting functionality and improve pagination

export type CharacterSortOption = 'name' | 'power' | 'intelligence' | 'publisher' | 'alignment';
export type SortDirection = 'asc' | 'desc';

// Add sort parameters to api functions
export async function getAllCharacters(
  limit?: number, 
  offset: number = 0,
  sortBy: CharacterSortOption = 'name',
  sortDirection: SortDirection = 'asc'
): Promise<Character[]> {
  try {
    // Build the API URL with parameters for our Next.js API route
    const url = `/api/characters?${limit ? `limit=${limit}&` : ''}offset=${offset}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    
    console.log('Fetching characters from API:', url);
    
    // Make the request to our Next.js API route
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching characters from API route:', error);
    // Fall back to client-side filtering of mock data if API fails
    console.log('Falling back to mock data for character retrieval');
    
    // Apply sorting and pagination on mock data as fallback
    const allCharacters = [...mockCharacters];
    
    // Sort characters based on the sortBy parameter
    allCharacters.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'power':
          valueA = parseInt(a.powerstats.power) || 0;
          valueB = parseInt(b.powerstats.power) || 0;
          break;
        case 'intelligence':
          valueA = parseInt(a.powerstats.intelligence) || 0;
          valueB = parseInt(b.powerstats.intelligence) || 0;
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
    
    // Apply pagination if limit is specified
    return limit ? allCharacters.slice(offset, offset + limit) : allCharacters.slice(offset);
  }
}

/**
 * Fetches a single character by ID
 * @param id Character ID to fetch
 */
export async function getCharacterById(id: number | string): Promise<Character | null> {
  try {
    // Build the API URL for our Next.js API route
    const url = `/api/characters/${id}`;
    
    // Make the request to our Next.js API route
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching character by ID from API route:', error);
    // We're letting the server API route handle fallbacks
    throw error;
  }
}

// Update search with sort parameters and no default limit
export async function searchCharacters(
  query: string, 
  limit?: number,
  offset: number = 0,
  sortBy: CharacterSortOption = 'name',
  sortDirection: SortDirection = 'asc'
): Promise<Character[]> {
  try {
    if (!query.trim()) {
      return [];
    }
    
    // Build the API URL with parameters for our Next.js API route
    const url = `/api/characters/search?query=${encodeURIComponent(query)}${limit ? `&limit=${limit}` : ''}&offset=${offset}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    
    console.log('Searching characters from API:', url);
    
    // Make the request to our Next.js API route
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching characters from API route:', error);
    // Fall back to client-side filtering if API fails
    console.log('Falling back to mock data for character search');
    
    // Filter characters based on the query
    const filteredCharacters = mockCharacters.filter(char => {
      const lowerQuery = query.toLowerCase();
      // Search in name and other relevant fields
      return (
        char.name.toLowerCase().includes(lowerQuery) ||
        (char.biography['full-name'] && char.biography['full-name'].toLowerCase().includes(lowerQuery)) ||
        (char.biography.publisher && char.biography.publisher.toLowerCase().includes(lowerQuery))
      );
    });
    
    // Sort characters based on the sortBy parameter
    filteredCharacters.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'power':
          valueA = parseInt(a.powerstats.power) || 0;
          valueB = parseInt(b.powerstats.power) || 0;
          break;
        case 'intelligence':
          valueA = parseInt(a.powerstats.intelligence) || 0;
          valueB = parseInt(b.powerstats.intelligence) || 0;
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
    
    // Apply pagination if limit is specified
    return limit ? filteredCharacters.slice(offset, offset + limit) : filteredCharacters.slice(offset);
  }
}

// Function to get total character count for pagination
export async function getCharacterCount(query?: string): Promise<number> {
  try {
    // URL for the count endpoint
    const url = query 
      ? `/api/characters/count?query=${encodeURIComponent(query)}` 
      : `/api/characters/count`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching character count from API:', error);
    // Fallback to client-side counting
    
    if (query) {
      const filteredCharacters = mockCharacters.filter(char => {
        const lowerQuery = query.toLowerCase();
        return (
          char.name.toLowerCase().includes(lowerQuery) ||
          (char.biography['full-name'] && char.biography['full-name'].toLowerCase().includes(lowerQuery)) ||
          (char.biography.publisher && char.biography.publisher.toLowerCase().includes(lowerQuery))
        );
      });
      return filteredCharacters.length;
    }
    
    return mockCharacters.length;
  }
} 