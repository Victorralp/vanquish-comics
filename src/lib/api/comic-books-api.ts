import { Comic } from './mock-comics';
import mockComics from './mock-comics';
import comicsApi from 'comicbooks-api';

// Simulate network delay for transitioning
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Log available methods in the API
console.log('Available methods in comicbooks-api:', Object.keys(comicsApi));

// Transform the API response to our Comic interface
const transformComicData = (apiComic: any): Comic => {
  return {
    id: generateComicId(apiComic.title, apiComic.coverPage), // Include coverPage for unique IDs
    title: apiComic.title?.replace(/\(\d{4}\)$/, '').trim() || 'Unknown Title', // Remove year from title
    description: apiComic.description || 'No description available',
    coverImageUrl: apiComic.coverPage || 'https://placehold.co/400x600/111827/ffffff?text=Comic+Cover',
    // Extract issue number from title if present
    issueNumber: extractIssueNumber(apiComic.title),
    // Extract release date from title or information if available
    releaseDate: extractYear(apiComic.title, apiComic.information),
    creators: {
      writer: [],
      artist: [],
    },
    featuredCharacters: [],
    // Add download links from the API
    downloadLinks: apiComic.downloadLinks || {},
    // Add additional information like size and format
    additionalInfo: apiComic.information || {}
  };
};

// Helper to extract issue number from title
const extractIssueNumber = (title: string): string | undefined => {
  if (!title) return undefined;
  const match = title.match(/#(\d+)/);
  return match ? match[1] : undefined;
};

// Helper to extract year from title or information
const extractYear = (title: string, information: any): string | undefined => {
  // Look for year in information object first
  if (information && information.Year) {
    return `${information.Year}-01-01`; // Default to January 1st of the year
  }
  
  // Then look for year in title
  if (title) {
    const match = title.match(/\((\d{4})\)$/);
    return match ? `${match[1]}-01-01` : undefined;
  }
  
  return undefined;
};

// Helper to generate an ID from title
const generateComicId = (title: string, coverUrl?: string): number => {
  // Generate a deterministic hash from the title and cover URL
  const uniqueString = `${title || ''}-${coverUrl || ''}-${Math.random()}`;
  let hash = 0;
  for (let i = 0; i < uniqueString.length; i++) {
    const char = uniqueString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Transform API results and ensure unique IDs
const processResults = (comics: any[]): Comic[] => {
  if (!comics || !Array.isArray(comics)) {
    console.error('Invalid comics data received:', comics);
    return [];
  }
  
  const idMap = new Map<number, boolean>();
  const uniqueResults: Comic[] = [];
  
  for (const comic of comics) {
    try {
      const transformedComic = transformComicData(comic);
      
      // If we already have a comic with this ID, modify it slightly
      if (idMap.has(transformedComic.id)) {
        transformedComic.id = transformedComic.id + Math.floor(Math.random() * 1000);
      }
      
      // Now add to our results and mark this ID as used
      idMap.set(transformedComic.id, true);
      uniqueResults.push(transformedComic);
    } catch (error) {
      console.error('Error transforming comic:', error);
      // Continue with next comic
    }
  }
  
  return uniqueResults;
};

// Check if we're offline or experiencing network issues
let isOffline = false;
let networkErrorCount = 0;
const MAX_NETWORK_ERRORS = 3;

// Reset network error count every 5 minutes to allow retrying
setInterval(() => {
  if (networkErrorCount > 0) {
    console.log('Resetting network error count to allow retrying API');
    networkErrorCount = 0;
    isOffline = false;
  }
}, 5 * 60 * 1000);

// Safely call an API method with fallback to mock data
const safeApiCall = async (methodName: string, ...args: any[]): Promise<any[]> => {
  // If we've detected we're offline, skip API calls and use mock data immediately
  if (isOffline) {
    console.log('Operating in offline mode - using mock data');
    return getMockComics(methodName, ...args);
  }
  
  try {
    // Check if method exists
    if (typeof (comicsApi as any)[methodName] === 'function') {
      const result = await (comicsApi as any)[methodName](...args);
      
      // Successfully got data - reset network error count
      networkErrorCount = 0;
      
      // Verify result is valid
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
      console.log(`Method ${methodName} returned no results, falling back to getLatestComics`);
    } else {
      console.log(`Method ${methodName} not found in comicbooks-api, falling back to getLatestComics`);
    }
    
    // Fallback to getLatestComics
    return await comicsApi.getLatestComics(args[0] || 1);
  } catch (error) {
    console.error(`Error calling ${methodName}:`, error);
    
    // Check if it's a network error (likely AxiosError)
    if (error.message === 'Network Error' || 
        error.code === 'ECONNABORTED' || 
        error.message?.includes('timeout') ||
        error.message?.includes('network')) {
      networkErrorCount++;
      console.warn(`Network error detected (${networkErrorCount}/${MAX_NETWORK_ERRORS})`);
      
      // If we've had multiple network errors, switch to offline mode
      if (networkErrorCount >= MAX_NETWORK_ERRORS) {
        console.warn('Multiple network errors detected - switching to offline mode with mock data');
        isOffline = true;
      }
    }
    
    // Fall back to mock data
    return getMockComics(methodName, ...args);
  }
};

// Get mock comics based on the method called
const getMockComics = (methodName: string, ...args: any[]): any[] => {
  console.log(`Using mock data for ${methodName}`);
  
  // Parse query or publisher from args
  const query = typeof args[0] === 'string' ? args[0].toLowerCase() : '';
  const page = typeof args[0] === 'number' ? args[0] : (typeof args[1] === 'number' ? args[1] : 1);
  const itemsPerPage = 20;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  // Clone the mock data to avoid modifying the original
  let comicsToReturn = [...mockComics];
  
  // Filter based on methodName
  if (methodName === 'getComicsThroughSearch' && query) {
    comicsToReturn = comicsToReturn.filter(comic => 
      comic.title.toLowerCase().includes(query) || 
      (comic.description && comic.description.toLowerCase().includes(query))
    );
  } else if (methodName.startsWith('get') && methodName.endsWith('Comics')) {
    // Extract publisher from method name
    const publisher = methodName.replace('get', '').replace('Comics', '').toLowerCase();
    
    if (publisher === 'marvel') {
      comicsToReturn = comicsToReturn.filter(c => c.title.toLowerCase().includes('marvel') || 
                                                 c.description?.toLowerCase().includes('marvel'));
    } else if (publisher === 'dc') {
      comicsToReturn = comicsToReturn.filter(c => c.title.toLowerCase().includes('dc') || 
                                               c.description?.toLowerCase().includes('dc'));
    } else if (publisher === 'image') {
      comicsToReturn = comicsToReturn.filter(c => c.title.toLowerCase().includes('image'));
    }
    // Add more publisher filters as needed
  }
  
  // Return paginated results to simulate API behavior
  return comicsToReturn.slice(start, end);
};

// Get latest comics with pagination
export async function getLatestComics(page: number = 1): Promise<Comic[]> {
  try {
    console.log(`Fetching latest comics, page ${page}`);
    
    // First try to get from API
    const comics = await safeApiCall('getLatestComics', page);
    
    // Transform and ensure unique IDs
    return processResults(comics);
  } catch (error) {
    console.error('Error fetching latest comics:', error);
    await delay(300); // Add delay before returning empty result
    
    // Last resort fallback
    return processResults(getMockComics('getLatestComics', page));
  }
}

// Search comics with pagination
export async function searchComics(query: string, page: number = 1): Promise<Comic[]> {
  try {
    console.log(`Searching comics for "${query}", page ${page}`);
    
    // Search comics from the API
    const comics = await safeApiCall('getComicsThroughSearch', query, page);
    
    // Transform and ensure unique IDs
    return processResults(comics);
  } catch (error) {
    console.error('Error searching comics:', error);
    await delay(300); // Add delay before returning empty result
    
    // Last resort fallback
    return processResults(getMockComics('getComicsThroughSearch', query, page));
  }
}

// Get comics by publisher
export async function getComicsByPublisher(publisher: string, page: number = 1): Promise<Comic[]> {
  try {
    console.log(`Fetching comics for publisher "${publisher}", page ${page}`);
    
    let methodName = '';
    
    // Map publisher name to the corresponding API method name
    switch (publisher.toLowerCase()) {
      case 'marvel':
        methodName = 'getMarvelComics';
        break;
      case 'dc':
        methodName = 'getDCComics';
        break;
      case 'image':
        methodName = 'getImageComics';
        break;
      case 'dark horse':
        methodName = 'getDarkHorseComic'; // Note: API might use singular form
        break;
      case 'boom studios':
        methodName = 'getBoomStudiosComics';
        break;
      case 'idw':
        methodName = 'getIDWComics';
        break;
      case 'dynamite':
        methodName = 'getDynamiteComics';
        break;
      default:
        methodName = 'getLatestComics';
    }
    
    // Call the appropriate method or fall back
    const comics = await safeApiCall(methodName, page);
    
    // Transform and ensure unique IDs
    return processResults(comics);
  } catch (error) {
    console.error(`Error fetching ${publisher} comics:`, error);
    await delay(300); // Add delay before returning empty result
    
    // Last resort fallback
    return processResults(getMockComics(`get${publisher.replace(/\s+/g, '')}Comics`, page));
  }
}

// Get a comic by ID
export async function getComicById(id: number): Promise<Comic | null> {
  try {
    console.log(`Looking for comic with ID: ${id}`);
    
    // Check if we're in offline mode
    if (isOffline) {
      console.log('Operating in offline mode - using mock data for comic lookup');
      const mockComic = mockComics.find(c => c.id === id);
      if (mockComic) {
        return {
          ...mockComic,
          _source: 'offline_mock'
        };
      }
    }
    
    // First, check in the latest comics
    let comic = null;
    
    // Try multiple sources for finding the comic
    const sourcesToTry = [
      { name: 'Latest Comics', fetcher: () => getLatestComics(1) },
      { name: 'Marvel Comics', fetcher: () => getComicsByPublisher('marvel', 1) },
      { name: 'DC Comics', fetcher: () => getComicsByPublisher('dc', 1) },
      { name: 'Image Comics', fetcher: () => getComicsByPublisher('image', 1) }
    ];
    
    for (const source of sourcesToTry) {
      try {
        console.log(`Searching for comic in ${source.name}...`);
        const comics = await source.fetcher();
        comic = comics.find(c => c.id === id);
        if (comic) {
          console.log(`Found comic in ${source.name}!`);
          break;
        }
      } catch (sourceError) {
        console.error(`Error searching ${source.name}:`, sourceError);
      }
    }
    
    // If comic is found, add a special flag to mark it was found by direct ID lookup
    if (comic) {
      return {
        ...comic,
        _source: 'found_by_id'
      };
    }
    
    // Check for the comic in mock data as a fallback
    const mockComic = mockComics.find(c => c.id === id);
    if (mockComic) {
      console.log('Found comic in mock data!');
      return {
        ...mockComic,
        _source: 'mock_data'
      };
    }
    
    // Create a placeholder comic object with the ID if not found anywhere
    console.log('Creating placeholder comic with ID:', id);
    return {
      id: id,
      title: `Comic #${id}`,
      description: 'We could not find detailed information for this comic. Try browsing comics by publisher.',
      coverImageUrl: 'https://placehold.co/400x600/111827/ffffff?text=Comic+Cover',
      issueNumber: '1',
      releaseDate: undefined,
      creators: {
        writer: [],
        artist: [],
      },
      featuredCharacters: [],
      downloadLinks: {
        READONLINE: 'https://getcomics.info/'
      },
      additionalInfo: {},
      _source: 'placeholder'
    };
  } catch (error) {
    console.error('Error fetching comic by ID:', error);
    
    // Check mock data as fallback
    const mockComic = mockComics.find(c => c.id === id);
    if (mockComic) {
      return {
        ...mockComic,
        _source: 'error_fallback_mock'
      };
    }
    
    // Return a placeholder for error cases
    return {
      id: id,
      title: `Comic #${id}`,
      description: 'Error loading comic details. Please try again later.',
      coverImageUrl: 'https://placehold.co/400x600/111827/ffffff?text=Comic+Cover',
      issueNumber: undefined,
      releaseDate: undefined,
      creators: {
        writer: [],
        artist: [],
      },
      featuredCharacters: [],
      downloadLinks: {
        READONLINE: 'https://getcomics.info/'
      },
      additionalInfo: {},
      _source: 'error'
    };
  }
} 