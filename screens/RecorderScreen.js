import React from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import styles from '../styles'; // Import your external styles file
import Icon from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons for a consistent feel
import * as Animatable from 'react-native-animatable'; // For button animation
import Slider from '@react-native-community/slider'; // Import Slider

export default function RecorderScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [currentDuration, setCurrentDuration] = React.useState(0);
  const [playingSound, setPlayingSound] = React.useState(null);
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = React.useState(0);
  const [soundDuration, setSoundDuration] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState(''); // State for search query

  // Function to rename a recording
  const renameRecording = (index) => {
    Alert.prompt(
      'Rename Recording',
      'Enter a new name for this recording:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Rename',
          onPress: (newName) => {
            setRecordings((prevRecordings) => {
              const updatedRecordings = [...prevRecordings];
              updatedRecordings[index].name = newName; // Update name of the recording
              return updatedRecordings;
            });
          },
        },
      ],
      'plain-text',
      recordings[index].name || `Recording #${index + 1}`, // Default name
    );
  };

  // Function to filter recordings based on search query
  const filteredRecordings = recordings.filter((recording) =>
    recording.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    setSoundDuration(status.durationMillis); // Save the total duration of the sound

    setRecordings((prev) => [
      ...prev,
      {
        name: `Recording #${prev.length + 1}`, // Default name
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      },
    ]);
    setCurrentDuration(0);
  }

  async function pauseRecording() {
    if (recording) {
      await recording.pauseAsync();
    }
  }

  async function discardRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    setCurrentDuration(0);
  }

  async function playRecording(sound) {
    if (playingSound) {
      await playingSound.stopAsync();
      setPlayingSound(null);
      setCurrentPlaybackPosition(0);
    }

    setPlayingSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isPlaying) {
        setCurrentPlaybackPosition(status.positionMillis);
      }
      if (status.didJustFinish) {
        setPlayingSound(null);
        setCurrentPlaybackPosition(0);
      }
    });

    await sound.replayAsync();
  }

  // Function to handle slider change
  const onSliderValueChange = async (value) => {
    if (playingSound) {
      // Seek the playback to the new position
      await playingSound.setPositionAsync(value);
      setCurrentPlaybackPosition(value);
    }
  };

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🎙️ Voice Recorder</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search recordings..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Recording Timer */}
      {recording && (
        <View style={styles.timerContainer}>
          <Text style={styles.durationText}>
            Recording: {getDurationFormatted(currentDuration)}
          </Text>
        </View>
      )}

      {/* Playback Timer */}
      {playingSound && (
        <View>
          <Text style={styles.durationText}>
            Playing: {getDurationFormatted(currentPlaybackPosition)} / {getDurationFormatted(soundDuration)}
          </Text>

          {/* Playback Slider */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={soundDuration}
            value={currentPlaybackPosition}
            onValueChange={onSliderValueChange}
            thumbTintColor="#00BFA5"
            minimumTrackTintColor="#00BFA5"
            maximumTrackTintColor="#D3D3D3"
          />
        </View>
      )}

      {/* Recording Controls */}
      <View style={styles.controlsContainer}>
        {recording ? (
          <>
            <TouchableOpacity style={styles.controlButton} onPress={pauseRecording}>
              <Icon name="pause-circle-filled" size={50} color="#00BFA5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={stopRecording}>
              <Icon name="stop-circle" size={50} color="#00BFA5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={discardRecording}>
              <Icon name="delete-forever" size={50} color="#D32F2F" />
            </TouchableOpacity>
          </>
        ) : (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={styles.recordButtonContainer}
          >
            <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
              <Icon name="fiber-manual-record" size={60} color="#fff" />
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>

      {/* Recordings List */}
      <FlatList
        data={filteredRecordings} // Use filtered recordings based on search query
        renderItem={({ item, index }) => (
          <View style={styles.recordingCard}>
            <Text style={styles.recordingText}>
              {item.name} | {item.duration}
            </Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playRecording(item.sound)}
            >
              <Icon name="play-circle-filled" size={40} color="#00BFA5" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.renameButton}
              onPress={() => renameRecording(index)} // Rename recording
            >
              <Icon name="edit" size={30} color="#FF9800" />
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
          <Text style={styles.clearButtonText}>Clear All Recordings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
