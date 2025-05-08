import { logEvent as logFirebaseEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase/firebase';

type EventData = Record<string, string | number | boolean | null | undefined>;

/**
 * Log an event to Firebase Analytics
 * @param eventName The name of the event to log
 * @param data Optional data to include with the event
 */
export function logEvent(eventName: string, data?: EventData): void {
  try {
    // Only log if we have analytics initialized
    if (typeof window !== 'undefined' && analytics) {
      console.log(`Analytics event: ${eventName}`, data);
      logFirebaseEvent(analytics, eventName, data);
    }
  } catch (error) {
    // Don't let analytics errors affect the user experience
    console.error('Error logging analytics event:', error);
  }
}

/**
 * Log a page view event
 * @param pageName The name of the page
 * @param pageLocation Optional page URL
 */
export function logPageView(pageName: string, pageLocation?: string): void {
  logEvent('page_view', {
    page_title: pageName,
    page_location: pageLocation || window.location.href,
  });
}

/**
 * Log a search event
 * @param searchTerm The search term
 * @param searchType The type of search (comics, characters, etc.)
 * @param resultsCount Optional count of search results
 */
export function logSearch(searchTerm: string, searchType: string, resultsCount?: number): void {
  logEvent('search', {
    search_term: searchTerm,
    search_type: searchType,
    results_count: resultsCount,
  });
}

/**
 * Log a content view event (comic or character detail)
 * @param contentId Content ID
 * @param contentName Content name/title
 * @param contentType Type of content (comic, character)
 */
export function logContentView(contentId: string | number, contentName: string, contentType: string): void {
  logEvent('content_view', {
    content_id: String(contentId),
    content_name: contentName,
    content_type: contentType,
  });
}

/**
 * Log a favorites action (add/remove)
 * @param action The action (add, remove)
 * @param itemId Item ID
 * @param itemName Item name
 * @param itemType Item type (comic, character)
 */
export function logFavoriteAction(
  action: 'add' | 'remove',
  itemId: string | number,
  itemName: string,
  itemType: string
): void {
  logEvent(`favorite_${action}`, {
    item_id: String(itemId),
    item_name: itemName,
    item_type: itemType,
  });
}

/**
 * Log a user authentication event
 * @param method Authentication method (email, google, etc.)
 * @param action The action (login, signup, logout)
 */
export function logAuth(method: string, action: 'login' | 'signup' | 'logout'): void {
  logEvent(`auth_${action}`, {
    auth_method: method,
  });
} 