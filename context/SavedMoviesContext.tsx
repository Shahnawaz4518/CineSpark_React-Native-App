import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@saved_movies";

interface SavedMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    savedAt: string;
}

interface SavedMoviesContextType {
    savedMovies: SavedMovie[];
    toggleSaveMovie: (movie: SavedMovie) => void;
    isMovieSaved: (id: number) => boolean;
    clearAll: () => void;
    savedCount: number;
}

const SavedMoviesContext = createContext<SavedMoviesContextType>({
    savedMovies: [],
    toggleSaveMovie: () => { },
    isMovieSaved: () => false,
    clearAll: () => { },
    savedCount: 0,
});

export const useSavedMovies = () => useContext(SavedMoviesContext);

export const SavedMoviesProvider = ({ children }: { children: React.ReactNode }) => {
    const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);

    // Load from AsyncStorage on mount
    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setSavedMovies(JSON.parse(stored));
                }
            } catch (err) {
                console.error("Failed to load saved movies:", err);
            }
        };
        load();
    }, []);

    // Persist whenever savedMovies changes
    const persist = async (movies: SavedMovie[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
        } catch (err) {
            console.error("Failed to persist saved movies:", err);
        }
    };

    const toggleSaveMovie = useCallback((movie: SavedMovie) => {
        setSavedMovies((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            const updated = exists
                ? prev.filter((m) => m.id !== movie.id)
                : [...prev, { ...movie, savedAt: new Date().toISOString() }];
            persist(updated);
            return updated;
        });
    }, []);

    const isMovieSaved = useCallback(
        (id: number) => savedMovies.some((m) => m.id === id),
        [savedMovies]
    );

    const clearAll = useCallback(() => {
        setSavedMovies([]);
        persist([]);
    }, []);

    return (
        <SavedMoviesContext.Provider
            value={{
                savedMovies,
                toggleSaveMovie,
                isMovieSaved,
                clearAll,
                savedCount: savedMovies.length,
            }}
        >
            {children}
        </SavedMoviesContext.Provider>
    );
};

export default SavedMoviesContext;
