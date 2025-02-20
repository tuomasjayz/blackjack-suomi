import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Korttipakan luonti ja sekoitus
const createDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];
  
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  
  // Sekoitetaan pakka
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

// Kortin arvon laskeminen
const getCardValue = (card) => {
  if (!card) return 0;
  if (card.value === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  return parseInt(card.value);
};

// Käden arvon laskeminen
const calculateHand = (hand) => {
  if (!hand || hand.length === 0) return 0;
  
  let value = 0;
  let aces = 0;
  
  for (let card of hand) {
    if (!card) continue;
    if (card.value === 'A') {
      aces += 1;
    } else {
      value += getCardValue(card);
    }
  }
  
  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }
  
  return value;
};

export default function Game() {
  const router = useRouter();
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0
  });

  // Pelin alustus
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newDeck = createDeck();
    if (newDeck.length < 4) return; // Varmistetaan että pakassa on tarpeeksi kortteja

    const pHand = [newDeck.pop(), newDeck.pop()];
    const dHand = [newDeck.pop(), newDeck.pop()];
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameOver(false);
    setMessage('');
  };

  const startNewGame = () => {
    initializeGame();
  };

  const updateStats = (result) => {
    setStats(prevStats => {
      const newStats = {
        ...prevStats,
        gamesPlayed: prevStats.gamesPlayed + 1
      };

      switch (result) {
        case 'win':
          newStats.wins = prevStats.wins + 1;
          break;
        case 'loss':
          newStats.losses = prevStats.losses + 1;
          break;
        case 'draw':
          newStats.draws = prevStats.draws + 1;
          break;
      }

      return newStats;
    });
  };

  // Nosta kortti
  const hit = () => {
    if (gameOver || deck.length === 0) return;
    
    const newCard = deck[deck.length - 1];
    if (!newCard) return;

    const newHand = [...playerHand, newCard];
    const newDeck = [...deck.slice(0, -1)];
    
    setPlayerHand(newHand);
    setDeck(newDeck);
    
    const handValue = calculateHand(newHand);
    if (handValue > 21) {
      setGameOver(true);
      setMessage('Yli meni! Hävisit pelin.');
      updateStats('loss');
    }
  };

  // Jää tähän
  const stand = () => {
    if (gameOver) return;
    
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHand(currentDealerHand) < 17 && currentDeck.length > 0) {
      const newCard = currentDeck.pop();
      if (newCard) {
        currentDealerHand.push(newCard);
      }
    }
    
    setDealerHand(currentDealerHand);
    setDeck(currentDeck);
    
    const playerValue = calculateHand(playerHand);
    const dealerValue = calculateHand(currentDealerHand);
    
    setGameOver(true);
    
    if (dealerValue > 21) {
      setMessage('Jakaja meni yli! Voitit pelin!');
      updateStats('win');
    } else if (dealerValue > playerValue) {
      setMessage('Jakaja voitti!');
      updateStats('loss');
    } else if (dealerValue < playerValue) {
      setMessage('Sinä voitit!');
      updateStats('win');
    } else {
      setMessage('Tasapeli!');
      updateStats('draw');
    }
  };

  const getWinPercentage = () => {
    if (stats.gamesPlayed === 0) return 0;
    return ((stats.wins / stats.gamesPlayed) * 100).toFixed(1);
  };

  const renderCard = (card, index, isDealer = false) => {
    if (!card) return null;
    
    const isHidden = isDealer && index > 0 && !gameOver;
    const cardStyle = [
      styles.card,
      { backgroundColor: isHidden ? '#2C3E50' : (card.suit === '♥' || card.suit === '♦' ? '#ffebee' : '#fff') }
    ];
    
    return (
      <View key={index} style={cardStyle}>
        <Text style={[
          styles.cardText,
          { color: isHidden ? '#2C3E50' : (card.suit === '♥' || card.suit === '♦' ? '#e53935' : '#000') }
        ]}>
          {isHidden ? '🂠' : `${card.value}${card.suit}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Voitot: {stats.wins}</Text>
        <Text style={styles.statsText}>Häviöt: {stats.losses}</Text>
        <Text style={styles.statsText}>Tasapelit: {stats.draws}</Text>
        <Text style={styles.statsText}>Voitto%: {getWinPercentage()}%</Text>
      </View>

      <View style={styles.dealerSection}>
        <Text style={styles.sectionTitle}>Jakajan kortit:</Text>
        <View style={styles.cards}>
          {dealerHand.map((card, index) => renderCard(card, index, true))}
        </View>
        <Text style={styles.score}>
          Pisteet: {gameOver ? calculateHand(dealerHand) : calculateHand([dealerHand[0]])}
        </Text>
      </View>

      {message ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      ) : null}

      <View style={styles.playerSection}>
        <Text style={styles.sectionTitle}>Sinun korttisi:</Text>
        <View style={styles.cards}>
          {playerHand.map((card, index) => renderCard(card, index))}
        </View>
        <Text style={styles.score}>Pisteet: {calculateHand(playerHand)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!gameOver && (
          <>
            <TouchableOpacity 
              style={[styles.button, deck.length === 0 && styles.disabledButton]} 
              onPress={hit}
              disabled={deck.length === 0}
            >
              <Text style={styles.buttonText}>Nosta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.standButton]} onPress={stand}>
              <Text style={styles.buttonText}>Jää</Text>
            </TouchableOpacity>
          </>
        )}
        {gameOver && (
          <TouchableOpacity style={[styles.button, styles.newGameButton]} onPress={startNewGame}>
            <Text style={styles.buttonText}>Uusi peli</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 20,
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dealerSection: {
    marginTop: 20,
  },
  playerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  score: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    minWidth: 130,
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
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  standButton: {
    backgroundColor: '#E67E22',
  },
  newGameButton: {
    backgroundColor: '#2980B9',
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 