import mockComics, { Comic } from './mock-comics';

// Simulate network delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllComics(limit?: number, offset: number = 0): Promise<Comic[]> {
  try {
    // Build the API URL with parameters for our Next.js API route
    const url = limit 
      ? `/api/comics?limit=${limit}&offset=${offset}` 
      : `/api/comics?offset=${offset}&noLimit=true`;
    
    // Make the request to our Next.js API route
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching comics from API route:', error);
    // Fallback to mock data if API route fails
    console.log('Falling back to mock data due to API error');
    
    // Simulate a delay for better user experience
    await delay(300);
    
    // Return all comics if no limit is specified
    if (limit === undefined) {
      return mockComics;
    }
    
    return mockComics.slice(offset, offset + limit);
  }
}

export async function getComicById(id: number): Promise<Comic | null> {
  try {
    // Build the API URL for our Next.js API route
    const url = `/api/comics/${id}`;
    
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
    console.error('Error fetching comic by ID from API route:', error);
    // Fallback to mock data if API route fails
    
    // Simulate a delay for better user experience
    await delay(200);
    
    const comic = mockComics.find(c => c.id === id);
    return comic || null;
  }
}

// Search comics functionality
export async function searchComics(query: string, limit?: number): Promise<Comic[]> {
  try {
    // Build the API URL with parameters for our Next.js API route
    const url = limit
      ? `/api/comics/search?query=${encodeURIComponent(query)}&limit=${limit}`
      : `/api/comics/search?query=${encodeURIComponent(query)}&noLimit=true`;
    
    // Make the request to our Next.js API route
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching comics from API route:', error);
    // Fallback to mock data if API route fails
    
    // Simulate a delay for better user experience
    await delay(300);
    
    // Return all matching results without limiting
    return mockComics.filter(comic => 
      comic.title.toLowerCase().includes(query.toLowerCase()) ||
      (comic.description && comic.description.toLowerCase().includes(query.toLowerCase()))
    );
  }
} 