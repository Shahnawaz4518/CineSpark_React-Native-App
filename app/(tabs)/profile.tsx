import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    FlatList,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";

const PRIMARY_COLOR = "#AB8BFF";
const { width } = Dimensions.get("window");

const Profile = () => {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const scale = useRef(new Animated.Value(1)).current;

    const { savedMovies, savedCount } = useSavedMovies();

    // Get recently saved (last 5)
    const recentlySaved = [...savedMovies]
        .sort(
            (a, b) =>
                new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        )
        .slice(0, 5);

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const animatePress = (callback?: () => void) => {
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();

        callback && callback();
    };

    return (
        <SafeAreaView className="bg-primary flex-1">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
            >
                {/* Header */}
                <Text className="text-white text-2xl font-bold mb-8">
                    Profile
                </Text>

                {/* Profile Image Section */}
                <View className="items-center mb-10">
                    <TouchableOpacity onPress={() => animatePress(pickImage)}>
                        <Animated.View
                            style={{
                                transform: [{ scale }],
                                borderColor: PRIMARY_COLOR,
                                borderWidth: 2,
                            }}
                            className="rounded-full p-1"
                        >
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    className="w-28 h-28 rounded-full"
                                />
                            ) : (
                                <View className="w-28 h-28 rounded-full bg-[#1e293b] justify-center items-center">
                                    <Image
                                        source={icons.person}
                                        className="w-12 h-12"
                                        tintColor="#ffffff"
                                    />
                                </View>
                            )}
                        </Animated.View>
                    </TouchableOpacity>

                    <Text className="text-white text-xl font-semibold mt-5">
                        Movie Enthusiast
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                        Your personal movie hub
                    </Text>

                    <Text
                        className="text-xs mt-2"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Tap image to change photo
                    </Text>
                </View>

                {/* Stats Section — Dynamic */}
                <View className="flex-row bg-[#1e293b] rounded-2xl p-6 mb-8 justify-between">
                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">
                            {savedCount}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">Saved</Text>
                    </View>

                    <View className="w-px bg-gray-700" />

                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">
                            {recentlySaved.length}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">Recent</Text>
                    </View>

                    <View className="w-px bg-gray-700" />

                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">
                            {savedMovies.reduce(
                                (sum, m) => sum + Math.round((m.vote_average || 0) / 2),
                                0
                            )}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">★ Total</Text>
                    </View>
                </View>

                {/* Recently Saved Section */}
                {recentlySaved.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-white text-lg font-bold">
                                Recently Saved
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/saved")}>
                                <Text style={{ color: PRIMARY_COLOR }} className="text-sm">
                                    See All →
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={recentlySaved}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ gap: 12 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.push(`/movies/${item.id}`)}
                                    style={{ width: (width - 72) / 3 }}
                                >
                                    <Image
                                        source={{
                                            uri: item.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
                                        }}
                                        className="h-40 rounded-lg"
                                        style={{ width: "100%" }}
                                        resizeMode="cover"
                                    />
                                    <Text
                                        className="text-white text-xs font-medium mt-2"
                                        numberOfLines={1}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {/* Empty recently saved */}
                {recentlySaved.length === 0 && (
                    <View className="bg-[#1e293b] rounded-2xl p-6 mb-8 items-center">
                        <Image
                            source={icons.save}
                            className="w-8 h-8 mb-3"
                            tintColor="#ffffff40"
                        />
                        <Text className="text-gray-400 text-sm text-center">
                            No saved movies yet. Browse and save movies to see them here.
                        </Text>
                    </View>
                )}

                {/* Menu Buttons */}
                <View>
                    {/* Watchlist Button */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="flex-row items-center justify-between p-5 rounded-xl mb-4"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                        onPress={() => router.push("/saved")}
                    >
                        <View className="flex-row items-center">
                            <Image
                                source={icons.save}
                                className="w-5 h-5 mr-4"
                                tintColor="#ffffff"
                            />
                            <Text className="text-white text-base font-medium">
                                My Watchlist
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="bg-white/20 px-2.5 py-1 rounded-full mr-2">
                                <Text className="text-white text-xs font-bold">
                                    {savedCount}
                                </Text>
                            </View>
                            <Text className="text-white text-lg">{">"}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Account Settings Button */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="flex-row items-center justify-between p-5 rounded-xl"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        <View className="flex-row items-center">
                            <Image
                                source={icons.person}
                                className="w-5 h-5 mr-4"
                                tintColor="#ffffff"
                            />
                            <Text className="text-white text-base font-medium">
                                Account Settings
                            </Text>
                        </View>
                        <Text className="text-white text-lg">{">"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;