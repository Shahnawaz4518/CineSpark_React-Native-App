import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
    Animated,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 3;

const PRIMARY_COLOR = "#AB8BFF";

const Save = () => {
    const router = useRouter();
    const { savedMovies, toggleSaveMovie, clearAll, savedCount } =
        useSavedMovies();
    const [removingId, setRemovingId] = useState<number | null>(null);

    const handleRemoveMovie = (movie: any) => {
        setRemovingId(movie.id);
        setTimeout(() => {
            toggleSaveMovie(movie);
            setRemovingId(null);
        }, 200);
    };

    const handleClearAll = () => {
        Alert.alert(
            "Remove All Movies",
            "Are you sure you want to remove all saved movies?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove All",
                    style: "destructive",
                    onPress: clearAll,
                },
            ]
        );
    };

    const renderMovieCard = ({ item }: { item: any }) => {
        const isRemoving = removingId === item.id;

        return (
            <Animated.View
                style={{
                    opacity: isRemoving ? 0.3 : 1,
                    width: CARD_WIDTH,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push(`/movies/${item.id}`)}
                    onLongPress={() => handleRemoveMovie(item)}
                >
                    <Image
                        source={{
                            uri: item.poster_path
                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
                        }}
                        className="h-44 rounded-xl"
                        style={{ width: "100%" }}
                        resizeMode="cover"
                    />

                    <Text
                        className="text-white text-xs font-semibold mt-2"
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>

                    <View className="flex-row items-center gap-x-1 mt-1">
                        <Image source={icons.star} className="size-3" />
                        <Text className="text-light-300 text-xs">
                            {Math.round((item.vote_average || 0) / 2)}/5
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Remove button */}
                <TouchableOpacity
                    onPress={() => handleRemoveMovie(item)}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5"
                >
                    <Text className="text-white text-xs">✕</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center px-10 mt-20">
            <View className="bg-white/10 p-6 rounded-full mb-6">
                <Image
                    source={icons.save}
                    className="w-12 h-12"
                    tintColor="#ffffff50"
                />
            </View>
            <Text className="text-white text-xl font-bold text-center mb-2">
                No Saved Movies Yet
            </Text>
            <Text className="text-gray-400 text-center text-sm leading-5">
                Start exploring movies and tap the save button to add them to your
                collection.
            </Text>
            <TouchableOpacity
                className="mt-6 px-8 py-3 rounded-full"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onPress={() => router.push("/")}
            >
                <Text className="text-white font-semibold">Browse Movies</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={["#0f0c29", "#302b63", "#24243e"]}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <FlatList
                    data={savedMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMovieCard}
                    numColumns={3}
                    columnWrapperStyle={
                        savedMovies.length > 0
                            ? {
                                justifyContent: "flex-start",
                                gap: 12,
                                marginBottom: 16,
                            }
                            : undefined
                    }
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingBottom: 100,
                        flexGrow: 1,
                    }}
                    ListHeaderComponent={
                        <View className="mb-6">
                            {/* Header */}
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-white text-2xl font-bold">
                                    My Watchlist
                                </Text>
                                {savedCount > 0 && (
                                    <TouchableOpacity
                                        onPress={handleClearAll}
                                        className="bg-red-500/20 px-4 py-2 rounded-full"
                                    >
                                        <Text className="text-red-400 text-xs font-semibold">
                                            Remove All
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Count badge */}
                            <View className="flex-row items-center mt-1 mb-2">
                                <View
                                    className="px-3 py-1 rounded-full mr-2"
                                    style={{ backgroundColor: `${PRIMARY_COLOR}30` }}
                                >
                                    <Text style={{ color: PRIMARY_COLOR }} className="text-sm font-bold">
                                        {savedCount} {savedCount === 1 ? "movie" : "movies"}
                                    </Text>
                                </View>
                                {savedCount > 0 && (
                                    <Text className="text-gray-400 text-xs">
                                        Long press a card to remove
                                    </Text>
                                )}
                            </View>
                        </View>
                    }
                    ListEmptyComponent={<EmptyState />}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Save;