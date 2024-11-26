import { Stack } from "expo-router";
export default function NewPostLayout() {
  return (
    <Stack
    >
      <Stack.Screen name="index"
        options={{
          title: "Instagram",
        }}
      />
    </Stack>
  );
}