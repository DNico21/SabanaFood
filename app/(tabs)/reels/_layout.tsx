import { Stack } from "expo-router";

export default function ReelsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Instagram",
        }}
      />
    </Stack>
  );
}
