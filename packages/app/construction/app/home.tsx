import { View, Text, StyleSheet } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면</Text>
      <Text style={styles.subtitle}>환영합니다!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});
