import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Instagram" }} />
      <Stack.Screen name="editprofile" options={{ title: "Editar Perfil" }} />
      <Stack.Screen name="configuration" options={{ title: "Ajustes" }} />
      <Stack.Screen name="userPost" options={{ title: "Publicaciones" }} />
    </Stack>
  );
}
