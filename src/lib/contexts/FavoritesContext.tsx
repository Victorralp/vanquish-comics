import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, collection, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface Character {
  id: number;
  name: string;
  image: string;
}

interface MinimalCharacter {
  id: number;
  name: string;
  image: string;
}

export type FavoriteCollection = {
  id: string;
  name: string;
  description?: string;
  characters: MinimalCharacter[];
  createdAt: number;
};

interface FavoritesContextType {
  favorites: MinimalCharacter[];
  isFavorite: (id: number) => boolean;
  addFavorite: (character: MinimalCharacter) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  clearFavorites: () => Promise<void>;
  collections: FavoriteCollection[];
  createCollection: (name: string, description?: string) => Promise<FavoriteCollection>;
  updateCollection: (id: string, data: Partial<Omit<FavoriteCollection, 'id' | 'createdAt'>>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addCharacterToCollection: (collectionId: string, character: MinimalCharacter) => Promise<void>;
  removeCharacterFromCollection: (collectionId: string, characterId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<MinimalCharacter[]>([]);
  const [collections, setCollections] = useState<FavoriteCollection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Flag to determine whether to use localStorage or Firebase for collections
  // Set to true if Firebase isn't available or for development
  const useLocalStorage = !db || typeof db.doc !== 'function';

  // Load favorites from localStorage for non-authenticated users
  // or from Firestore for authenticated users
  useEffect(() => {
    const loadFavorites = async () => {
      if (user && db && typeof db.doc === 'function') {
        try {
          // Get favorites from Firestore if user is authenticated
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && docSnap.data().favorites) {
            setFavorites(docSnap.data().favorites);
          }
        } catch (error) {
          console.error('Error loading favorites from Firestore:', error);
          // Fallback to localStorage if Firestore fails
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } else {
        // Get favorites from localStorage if not authenticated
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    };

    loadFavorites();
  }, [user]);

  // Save to localStorage when favorites change (for non-authenticated users)
  useEffect(() => {
    if (!user && favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Load collections from localStorage or Firebase
  useEffect(() => {
    const loadCollections = async () => {
      if (!user) {
        setCollections([]);
        return;
      }

      try {
        // Implement either localStorage or Firebase approach based on your setup
        if (useLocalStorage) {
          const storedCollections = localStorage.getItem('vanquish-collections');
          if (storedCollections) {
            setCollections(JSON.parse(storedCollections));
          }
        } else {
          // If using Firebase
          const collectionsRef = collection(db, 'users', user.uid, 'collections');
          const collectionsSnapshot = await getDocs(collectionsRef);
          const collectionsData = collectionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FavoriteCollection[];
          setCollections(collectionsData);
        }
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };

    loadCollections();
  }, [user, useLocalStorage]);

  // Create a new collection
  const createCollection = async (name: string, description?: string): Promise<FavoriteCollection> => {
    if (!user) throw new Error('User not authenticated');
    
    const newCollection: FavoriteCollection = {
      id: crypto.randomUUID(), // Generate a UUID for local storage
      name,
      description,
      characters: [],
      createdAt: Date.now()
    };
    
    try {
      if (useLocalStorage) {
        const updatedCollections = [...collections, newCollection];
        localStorage.setItem('vanquish-collections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      } else {
        // If using Firebase
        const collectionsRef = collection(db, 'users', user.uid, 'collections');
        const docRef = await addDoc(collectionsRef, {
          name,
          description,
          characters: [],
          createdAt: serverTimestamp()
        });
        newCollection.id = docRef.id;
        setCollections(prev => [...prev, newCollection]);
      }
      
      return newCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection');
    }
  };

  // Update a collection
  const updateCollection = async (
    id: string, 
    data: Partial<Omit<FavoriteCollection, 'id' | 'createdAt'>>
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      if (useLocalStorage) {
        const updatedCollections = collections.map(collection => 
          collection.id === id ? { ...collection, ...data } : collection
        );
        localStorage.setItem('vanquish-collections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      } else {
        // If using Firebase
        const collectionRef = doc(db, 'users', user.uid, 'collections', id);
        await updateDoc(collectionRef, data);
        setCollections(prev => 
          prev.map(collection => 
            collection.id === id ? { ...collection, ...data } : collection
          )
        );
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      throw new Error('Failed to update collection');
    }
  };

  // Delete a collection
  const deleteCollection = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      if (useLocalStorage) {
        const updatedCollections = collections.filter(collection => collection.id !== id);
        localStorage.setItem('vanquish-collections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      } else {
        // If using Firebase
        const collectionRef = doc(db, 'users', user.uid, 'collections', id);
        await deleteDoc(collectionRef);
        setCollections(prev => prev.filter(collection => collection.id !== id));
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw new Error('Failed to delete collection');
    }
  };

  // Add a character to a collection
  const addCharacterToCollection = async (
    collectionId: string, 
    character: MinimalCharacter
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    // Check if character already exists in the collection
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) throw new Error('Collection not found');
    
    if (collection.characters.some(c => c.id === character.id)) {
      return; // Character already in collection
    }
    
    try {
      if (useLocalStorage) {
        const updatedCollections = collections.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              characters: [...collection.characters, character]
            };
          }
          return collection;
        });
        
        localStorage.setItem('vanquish-collections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      } else {
        // If using Firebase
        const collectionRef = doc(db, 'users', user.uid, 'collections', collectionId);
        await updateDoc(collectionRef, {
          characters: arrayUnion(character)
        });
        
        setCollections(prev => 
          prev.map(collection => {
            if (collection.id === collectionId) {
              return {
                ...collection,
                characters: [...collection.characters, character]
              };
            }
            return collection;
          })
        );
      }
    } catch (error) {
      console.error('Error adding character to collection:', error);
      throw new Error('Failed to add character to collection');
    }
  };

  // Remove a character from a collection
  const removeCharacterFromCollection = async (
    collectionId: string, 
    characterId: number
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      if (useLocalStorage) {
        const updatedCollections = collections.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              characters: collection.characters.filter(c => c.id !== characterId)
            };
          }
          return collection;
        });
        
        localStorage.setItem('vanquish-collections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      } else {
        // If using Firebase - requires different approach with arrayRemove
        const collectionRef = doc(db, 'users', user.uid, 'collections', collectionId);
        const collectionDoc = await getDoc(collectionRef);
        
        if (collectionDoc.exists()) {
          const collection = collectionDoc.data() as FavoriteCollection;
          const updatedCharacters = collection.characters.filter(c => c.id !== characterId);
          
          await updateDoc(collectionRef, {
            characters: updatedCharacters
          });
        }
        
        setCollections(prev => 
          prev.map(collection => {
            if (collection.id === collectionId) {
              return {
                ...collection,
                characters: collection.characters.filter(c => c.id !== characterId)
              };
            }
            return collection;
          })
        );
      }
    } catch (error) {
      console.error('Error removing character from collection:', error);
      throw new Error('Failed to remove character from collection');
    }
  };

  const addFavorite = async (character: MinimalCharacter) => {
    if (user && db && typeof db.doc === 'function') {
      try {
        // Add to Firestore if authenticated
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          favorites: arrayUnion(character)
        }, { merge: true });
      } catch (error) {
        console.error('Error adding favorite to Firestore:', error);
      }
    }

    // Add to local state
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(fav => fav.id === character.id)) {
        return [...prevFavorites, character];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = async (characterId: number) => {
    const characterToRemove = favorites.find(fav => fav.id === characterId);
    
    if (user && characterToRemove && db && typeof db.doc === 'function') {
      try {
        // Remove from Firestore if authenticated
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          favorites: arrayRemove(characterToRemove)
        }, { merge: true });
      } catch (error) {
        console.error('Error removing favorite from Firestore:', error);
      }
    }

    // Remove from local state
    setFavorites(prevFavorites => 
      prevFavorites.filter(fav => fav.id !== characterId)
    );
  };

  const isFavorite = (characterId: number) => {
    return favorites.some(fav => fav.id === characterId);
  };

  const clearFavorites = async () => {
    if (user && db && typeof db.doc === 'function') {
      try {
        // Remove from Firestore if authenticated
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          favorites: []
        }, { merge: true });
      } catch (error) {
        console.error('Error clearing favorites from Firestore:', error);
      }
    }

    // Remove from local state
    setFavorites([]);
  };

  const value = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addCharacterToCollection,
    removeCharacterFromCollection,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 