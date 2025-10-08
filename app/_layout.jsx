import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { HeaderBackButton } from '@react-navigation/elements'
import { Slot } from 'expo-router'


export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>

            <Slot />

        </ClerkProvider>
    )
}