/* OrbitLabs Login – Konfiguration
   Standard: "local" = Demo-Modus (Konten nur im Browser des jeweiligen Besuchers).
   Für ein ECHTES, geräteübergreifendes Login (kostenlos): Firebase-Projekt anlegen,
   Authentication > "E-Mail/Passwort" aktivieren und die Werte unten eintragen. */
window.ORBIT_AUTH = {
  /* Angezeigte Anmeldearten. Nur Anbieter eintragen, die in Firebase aktiviert sind.
     Verfügbar: google, apple, github, twitter, yahoo, phone, anonymous */
  providers: ['google','github','phone'],
  firebase: {
    apiKey: "AIzaSyAlOjxvjZvwmjQ0o1aKfRb9AF05ORVFiNk",
    authDomain: "orbitlabs-12650.firebaseapp.com",
    projectId: "orbitlabs-12650",
    appId: "1:725034844631:web:dae075dfdd21b72b5a0b92"
  }
};
