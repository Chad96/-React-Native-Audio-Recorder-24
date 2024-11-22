import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function RecordingsListScreen() {
  const recordings = ['Recording 1', 'Recording 2', 'Recording 3']; // Example data

  const handleBackup = (recording) => {
    alert(`${recording} backed up successfully!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recordings</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>{item}</Text>
            <TouchableOpacity onPress={() => handleBackup(item)} style={styles.backupButton}>
              <Text style={styles.backupButtonText}>Backup</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 20,
    textAlign: 'center',
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordingText: {
    fontSize: 16,
    color: '#333',
  },
  backupButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  backupButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
