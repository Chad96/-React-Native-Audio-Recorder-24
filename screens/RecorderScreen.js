import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Audio } from 'expo-av';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RecorderScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [currentDuration, setCurrentDuration] = React.useState(0); // Timer during recording
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = React.useState(0); // Timer during playback
  const [playingSound, setPlayingSound] = React.useState(null); // Currently playing sound reference

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

        recording.setOnRecordingStatusUpdate((status) => {
          if (status.isRecording) {
            setCurrentDuration(status.durationMillis);
          }
        });
      }
    } catch (err) {
      console.error('Error starting recording', err);
    }
  }

  // Stop recording
  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    setRecordings((prev) => [
      ...prev,
      {
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      },
    ]);
    setCurrentDuration(0); // Reset the duration
  }

  // Pause recording
  async function pauseRecording() {
    if (recording) {
      await recording.pauseAsync();
    }
  }

  // Discard recording
  async function discardRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    setCurrentDuration(0); // Reset the duration if discarded
  }

  // Play recording
  async function playRecording(sound) {
    if (playingSound) {
      await playingSound.stopAsync(); // Stop current sound
      setPlayingSound(null);
      setCurrentPlaybackPosition(0);
    }

    setPlayingSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isPlaying) {
        setCurrentPlaybackPosition(status.positionMillis);
      }
      if (status.didJustFinish) {
        setPlayingSound(null); // Reset after playback ends
        setCurrentPlaybackPosition(0);
      }
    });

    await sound.replayAsync();
  }

  // Format duration
  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  // Clear all recordings
  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Voice Recorder</Text>

      {/* Recording Timer */}
      {recording && (
        <Text style={styles.durationText}>
          Recording: {getDurationFormatted(currentDuration)}
        </Text>
      )}

      {/* Playback Timer */}
      {playingSound && (
        <Text style={styles.durationText}>
          Playing: {getDurationFormatted(currentPlaybackPosition)}
        </Text>
      )}

      {/* Recording Controls */}
      <View style={styles.controlsContainer}>
        {recording ? (
          <>
            <TouchableOpacity style={styles.controlButton} onPress={pauseRecording}>
              <Icon name="pause" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={stopRecording}>
              <Icon name="stop" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={discardRecording}>
              <Icon name="delete" size={30} color="#FFF" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        )}
      </View>

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
              onPress={() => playRecording(item.sound)}
            >
              <Text style={styles.buttonText}>Play</Text>
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
