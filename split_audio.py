import librosa
import numpy as np
import os
from pathlib import Path
import soundfile as sf


def preprocess_audio(file_path, output_folder, target_length=3, sample_rate=16000):
    try:
        # Load audio using soundfile
        print(f"Loading audio from {file_path}")
        audio, sr = sf.read(file_path)

        # Calculate target samples
        target_samples = target_length * sr
        print(f"Target samples per chunk: {target_samples}")

        # Create output folder if it doesn't exist
        os.makedirs(output_folder, exist_ok=True)

        # Split audio into chunks of target_length seconds
        num_chunks = int(np.floor(len(audio) / target_samples))  # Use floor to avoid last chunk if it's smaller
        print(f"Total number of chunks: {num_chunks}")

        for i in range(num_chunks):
            start_sample = i * target_samples
            end_sample = (i + 1) * target_samples  # The end_sample will be exactly target_samples for all chunks

            chunk = audio[start_sample:end_sample]
            print(f"Processing chunk {i + 1}: Start sample = {start_sample}, End sample = {end_sample}, Chunk size = {len(chunk)}")

            # Convert chunk to float32 for compatibility
            print(f"Converting chunk {i + 1} to float32")
            chunk = np.asarray(chunk, dtype=np.float32)

            # Create output file name, replacing spaces with underscores
            output_filename = f"{Path(file_path).stem.replace(' ', '_')}_chunk{i + 1}.wav"
            output_path = Path(output_folder) / output_filename

            # Save chunk as a new file
            print(f"Saving chunk {i + 1} to {output_path}")
            sf.write(output_path, chunk, sr, format='WAV')

    except Exception as e:
        print(f"Error processing {file_path}: {e}")


def process_folder(input_folder, output_folder, target_length=3, sample_rate=16000):
    # List all files and print them to ensure we're processing them correctly
    file_names = [file_name for file_name in os.listdir(input_folder)]
    print(f"Files in directory: {file_names}")

    for file_name in file_names:
        file_path = os.path.join(input_folder, file_name)

        print(f"Checking file: {file_name}")
        
        if os.path.isfile(file_path) and file_name.lower().endswith(".mp3"):
            print(f"Processing file: {file_name}")
            preprocess_audio(file_path, output_folder, target_length, sample_rate)
        else:
            print(f"Skipping file: {file_name}, not an MP3.")


# Example usage
input_folder = "input_audio"
output_folder = "output_audio"
print(f"Processing all audio files in {input_folder}...")
process_folder(input_folder, output_folder)
