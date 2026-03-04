import { Image, TextInput, TouchableOpacity } from 'react-native';
import { icons } from '@/constants/icons';
import React from 'react';

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
            activeOpacity={0.8}
        >
            <Image
                source={icons.search}
                className="size-5"
                resizeMode="contain"
                tintColor="#ab8bff"
            />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#a8b5db"
                className="flex-1 ml-2 text-white"
                value={value}
                onChangeText={onChangeText}
            />
        </TouchableOpacity>
    );
};

export default SearchBar;