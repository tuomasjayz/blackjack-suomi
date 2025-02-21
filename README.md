# Blackjack Peli

Yksinkertainen Blackjack-korttipeli, joka on toteutettu React Nativella ja Expo-frameworkilla.

## Ominaisuudet

- Perinteinen Blackjack-pelimekaniikka
- Pelaajatilastot (voitot, häviöt, tasapelit)
- Tilastojen tallennus Supabase-tietokantaan
- Responsiivinen käyttöliittymä

## Asennus

1. Asenna tarvittavat riippuvuudet:

   ```bash
   npm install
   ```

2. Käynnistä kehitysympäristö:

   ```bash
   npx expo start
   ```

3. Pelaa sovellusta:
- Expo Go -sovelluksella (kehitysversio)
- Tai rakenna itsenäinen APK:

   ```bash
   eas build -p android --profile preview
   ```

## Teknologiat

- React Native
- Expo Router
- Supabase (tietokanta)
- React Native Polyfills
