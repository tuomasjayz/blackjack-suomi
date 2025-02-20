import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

// Kotinäkymä pelaajalle
export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tervetuloa{'\n'}Blackjack-peliin!</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/game')}
        >
          <Text style={styles.buttonText}>Aloita Peli</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#27AE60',
    padding: 20,
    borderRadius: 12,
    width: 250,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 