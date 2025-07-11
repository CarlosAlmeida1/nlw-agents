type RecordingSession = {
  status: 'recording' | 'paused' | 'stopped'
  startedAt?: Date
  pausedAt?: Date
}

export const recordingSessions = new Map<string, RecordingSession>() 