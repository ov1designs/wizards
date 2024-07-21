<script>
    import { onMount } from 'svelte';
    import { createLessonAudioSubmission } from '../lib/pocketbase';
    import { currentUser } from '../lib/pocketbase';
    import Icon from "@iconify/svelte";
  
    export let lessonId;
    export let doctorAudioUrl;
    export let onSubmissionComplete = () => {};
  
    let audioContext;
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let audioUrl;
    let isRecording = false;
    let isPlaying = false;
    let audioDuration = 0;
    let currentTime = 0;
    let audioElement;
    let doctorAudioElement;
    let isDoctorAudioReady = false;
    let doctorAudioError = null;
  
    onMount(() => {
  audioElement = new Audio();
  if (doctorAudioUrl) {
    doctorAudioElement = new Audio();
    doctorAudioElement.preload = 'auto'; 
    console.log('Doctor Audio URL:', doctorAudioUrl);

    doctorAudioElement.addEventListener('canplaythrough', () => {
      isDoctorAudioReady = true;
      doctorAudioError = null;
    });

    doctorAudioElement.addEventListener('error', (e) => {
      console.error('Error loading doctor audio:', e);
      console.error('Error code:', e.target.error.code);
      console.error('Error message:', e.target.error.message);
      isDoctorAudioReady = false;
      doctorAudioError = e.target.error;
    });

    // Use fetch to check the audio file
    fetch(doctorAudioUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        doctorAudioElement.src = URL.createObjectURL(blob);
      })
      .catch(e => {
        console.error('Error fetching doctor audio:', e);
        doctorAudioError = e;
      });
  } else {
    console.warn('No doctor audio URL provided');
  }
  
  audioElement.addEventListener('timeupdate', updateTime);
  audioElement.addEventListener('loadedmetadata', () => {
    audioDuration = audioElement.duration;
  });

  return () => {
    audioElement.removeEventListener('timeupdate', updateTime);
    if (doctorAudioElement) {
      doctorAudioElement.removeEventListener('canplaythrough', () => {});
      doctorAudioElement.removeEventListener('error', () => {});
    }
  };
});
  
    function updateTime() {
      currentTime = audioElement.currentTime;
    }
  
    async function startRecording() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      try {
        await audioContext.resume();
        if (isDoctorAudioReady) {
          await doctorAudioElement.play();
        } else if (doctorAudioError) {
          console.warn('Doctor audio not available due to error:', doctorAudioError.message);
        } else {
          console.warn('Doctor audio not ready or not available');
        }
      } catch (error) {
        console.error('Error starting audio playback:', error);
        // Handle the error (e.g., show a message to the user)
        return;
      }
      
      audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(audioBlob);
        audioElement.src = audioUrl;
      };
      mediaRecorder.start();
      isRecording = true;
    }
  
    function stopRecording() {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        if (isDoctorAudioReady) {
          doctorAudioElement.pause();
          doctorAudioElement.currentTime = 0;
        }
        isRecording = false;
      }
    }
  
    function togglePlayback() {
      if (audioElement.paused) {
        audioElement.play();
        isPlaying = true;
      } else {
        audioElement.pause();
        isPlaying = false;
      }
    }
  
    function resetRecording() {
      audioChunks = [];
      audioBlob = null;
      audioUrl = null;
      audioElement.src = '';
      isPlaying = false;
      currentTime = 0;
      audioDuration = 0;
    }
  
    async function submitRecording() {
      if (!audioBlob) return;
  
      try {
        const userId = $currentUser.id;
        const record = await createLessonAudioSubmission(userId, lessonId, audioBlob);
        if (record) {
          console.log('Audio submission successful');
          onSubmissionComplete(record);
          resetRecording();
        } else {
          console.error('Failed to submit audio');
        }
      } catch (error) {
        console.error('Error submitting audio:', error);
      }
    }
</script>

<div class="audio-recorder-container bg-[#281C6C] text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Audio Recorder</h2>
    
    {#if doctorAudioError}
    <p class="text-red-500 mb-4">
        Error loading doctor's audio: {doctorAudioError.message || doctorAudioError}
        {#if doctorAudioError.code}
            (Error code: {doctorAudioError.code})
        {/if}
    </p>
{/if}
    
    <div class="flex flex-wrap gap-4 mb-6">
        {#if !isRecording}
            <button
                on:click={startRecording}
                class="flex items-center gap-2 bg-[#6248FF] hover:bg-[#6248FF]/80 transition-colors p-3 rounded"
            >
                <Icon icon="mdi:microphone" />
                Start Recording
            </button>
        {:else}
            <button
                on:click={stopRecording}
                class="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors p-3 rounded"
            >
                <Icon icon="mdi:stop" />
                Stop Recording
            </button>
        {/if}
        
        {#if audioBlob}
            <button
                on:click={togglePlayback}
                class="flex items-center gap-2 bg-[#6248FF] hover:bg-[#6248FF]/80 transition-colors p-3 rounded"
            >
                <Icon icon={isPlaying ? "mdi:pause" : "mdi:play"} />
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
                on:click={resetRecording}
                class="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 transition-colors p-3 rounded"
            >
                <Icon icon="mdi:refresh" />
                Reset
            </button>
            
            <button
                on:click={submitRecording}
                class="flex items-center gap-2 bg-green-500 hover:bg-green-600 transition-colors p-3 rounded"
            >
                <Icon icon="mdi:check" />
                Submit Recording
            </button>
        {/if}
    </div>
    
    {#if audioBlob}
        <div class="mb-4">
            <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-[#6248FF]">
                            Progress
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-semibold inline-block">
                            {Math.floor(currentTime)}s / {Math.floor(audioDuration)}s
                        </span>
                    </div>
                </div>
                <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/10">
                    <div
                        style="width:{(currentTime / audioDuration) * 100}%"
                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#6248FF] rounded-full transition-all duration-300 ease-in-out"
                    ></div>
                </div>
            </div>
        </div>
    {/if}
</div>