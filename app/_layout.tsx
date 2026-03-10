import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
    return <Stack>
        <Stack.Screen
            name="onboarding"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="auth/login"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="auth/register"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="career/[id]"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="profile/edit"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="profile/preferences"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="profile/support"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="profile/policy"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="profile/about"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="profile/notifications"
            options={{ headerShown: false }}
        />
    </Stack>;
}
