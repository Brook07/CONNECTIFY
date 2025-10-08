import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack screenOptions={{
    headerTitle:"Connectify",
    headerTitleStyle:{
      fontSize:25,
      color: '#008000'
    }
  }}/>
}