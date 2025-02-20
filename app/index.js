import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

// Kotinäkymä pelaajalle
export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async (name) => {
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_name', name)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const createNewStats = async (name) => {
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .insert([
          {
            player_name: name,
            wins: 0,
            losses: 0,
            draws: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating stats:', error);
      return null;
    }
  };

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      Alert.alert('Virhe', 'Syötä nimesi ennen pelin aloittamista');
      return;
    }

    setLoading(true);
    let playerStats = await loadStats(playerName);

    if (!playerStats) {
      playerStats = await createNewStats(playerName);
    }

    setLoading(false);

    if (playerStats) {
      router.replace({
        pathname: '/game',
        params: { playerName: playerName }
      });
    } else {
      Alert.alert('Virhe', 'Tilastojen lataaminen epäonnistui. Yritä uudelleen.');
    }
  };

  const resetStats = async () => {
    if (!playerName.trim()) {
      Alert.alert('Virhe', 'Syötä nimesi ennen tilastojen nollaamista');
      return;
    }

    Alert.alert(
      'Vahvista nollaus',
      'Haluatko varmasti nollata tilastosi? Tätä toimintoa ei voi perua.',
      [
        {
          text: 'Peruuta',
          style: 'cancel'
        },
        {
          text: 'Nollaa',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const { error } = await supabase
                .from('player_stats')
                .delete()
                .eq('player_name', playerName);

              if (error) throw error;

              const newStats = await createNewStats(playerName);
              if (newStats) {
                Alert.alert('Onnistui', 'Tilastot nollattu onnistuneesti');
                setStats(newStats);
              }
            } catch (error) {
              console.error('Error resetting stats:', error);
              Alert.alert('Virhe', 'Tilastojen nollaaminen epäonnistui');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tervetuloa{'\n'}Blackjack-peliin!</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Syötä nimesi:</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Pelaajan nimi"
            placeholderTextColor="#95a5a6"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleStartGame}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Aloita Peli</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.resetButton, loading && styles.disabledButton]}
          onPress={resetStats}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Nollaa Tilastot</Text>
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
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    fontSize: 18,
    color: '#2C3E50',
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
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: '#c0392b',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 