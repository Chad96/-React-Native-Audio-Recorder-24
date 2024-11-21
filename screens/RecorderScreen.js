import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Audio } from 'expo-av';
import styles from '../styles'; // Your existing styles

export default function RecorderScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);

  // Start recording
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error('Error starting recording', err);
    }
  }

  // Stop recording
  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    allRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setRecordings(allRecordings);
  }

  // Format duration
  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  // Get recording list with options
  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.recordingRow}>
          <Text style={styles.recordingText}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => recordingLine.sound.replayAsync()}
          >
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => editRecording(index)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteRecording(index)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  // Delete a recording
  function deleteRecording(index) {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            let updatedRecordings = [...recordings];
            updatedRecordings.splice(index, 1);
            setRecordings(updatedRecordings);
          },
        },
      ]
    );
  }

  // Edit a recording (replace)
  function editRecording(index) {
    const newRecordingUri = 'new_recording_file_path'; // Placeholder for edited file
    const newDuration = '00:00'; // Placeholder for new duration

    let updatedRecordings = [...recordings];
    updatedRecordings[index] = {
      ...updatedRecordings[index],
      file: newRecordingUri, // Replace the file path
      duration: newDuration, // Replace the duration
    };

    setRecordings(updatedRecordings);
  }

  // Clear all recordings
  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Voice Recorder</Text>

      {/* Recording Button */}
      <TouchableOpacity
        style={recording ? styles.stopButton : styles.recordButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {/* Recordings List */}
      <FlatList
        data={recordings}
        renderItem={({ item, index }) => (
          <View style={styles.recordingRow}>
            <Text style={styles.recordingText}>
              Recording #{index + 1} | {item.duration}
            </Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => item.sound.replayAsync()}
            >
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editRecording(index)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRecording(index)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.noRecordingsText}>
            No recordings yet. Start recording now!
          </Text>
        }
        style={styles.recordingsList}
      />

      {/* Clear Button */}
      {recordings.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearRecordings}>
          <Text style={styles.buttonText}>Clear Recordings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
 