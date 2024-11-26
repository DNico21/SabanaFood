import { Stack } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather'; 
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack
    >
      <Stack.Screen name="index"
        options={{
          title: "Instagram",
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              
              <Link href="/(tabs)/home/notifications" asChild>
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <Feather name="bell" size={30} color="black" />
                </TouchableOpacity>
              </Link>
              <Link href="/(tabs)/home/message" asChild>
                <TouchableOpacity>
                  <AntDesign name="message1" size={30} color="black" />
                </TouchableOpacity>
              </Link>
              
            </View>
          ),
        }}
      />
    </Stack>
  );
}