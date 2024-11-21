import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7', // Neutral background
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F80ED',
    marginBottom: 20,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#222B45',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: '#E0E7EF',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  controlIcon: {
    fontSize: 28,
    color: '#2F80ED',
  },
  recordingsList: {
    flex: 1,
    marginTop: 20,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  recordingText: {
    fontSize: 16,
    color: '#222B45',
    flex: 1,
  },
  playButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    backgroundColor: '#2F80ED',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  noRecordingsText: {
    textAlign: 'center',
    color: '#828282',
    fontSize: 16,
    marginTop: 30,
  },
  recordButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  recordButton: {
    backgroundColor: '#F4C542', // Yellow color for the button
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  
});

export default styles;
