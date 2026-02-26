import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl text-dark-200
      font-bold">Shahnawaz Khan</Text>

       {/* Routing And Routing Using Id  */}
      <Link href="/onboarding">Go to Onboarding</Link>
      <Link href="/movie/avengers">Avengers Movie</Link>
    </View>
  );
}
