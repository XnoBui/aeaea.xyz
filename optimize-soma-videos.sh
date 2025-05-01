#!/bin/bash

# Script to optimize videos for web loading while maintaining original resolution
# - Removes audio
# - Uses H.264 encoding with CRF 28
# - Adds faststart flag for better web streaming

echo "Starting video optimization (maintaining original resolution)..."
echo "This will create optimized versions with '_optimized' suffix."
echo ""

# Change to the videos directory
cd videos || { echo "Error: videos directory not found"; exit 1; }

# List of videos to optimize
VIDEOS=(
  "soma_draconic_class.mp4"
  "soma_humanoid_class.mp4"
  "vision.mp4"
  "soma_cybernetic_class.mp4"
  "soma_celestial_class.mp4"
  "cybernetic_protagonist/alita_cybernetic_protagonist.mp4"
  "cybernetic_protagonist/faye_cybernetic_protagonist.mp4"
)

# Count total videos
total=${#VIDEOS[@]}
echo "Found $total videos to process."
echo ""

# Process each video
count=0
for original in "${VIDEOS[@]}"; do
  count=$((count + 1))
  echo "[$count/$total] Processing $original..."
  
  # Skip if file doesn't exist
  if [ ! -f "$original" ]; then
    echo "File $original not found. Skipping."
    continue
  fi
  
  # Get original file size
  original_size=$(du -h "$original" | cut -f1)
  
  # Create output filename with _optimized suffix
  filename="${original%.*}"
  extension="${original##*.}"
  output="${filename}_optimized.${extension}"
  
  # Create output directory if it doesn't exist
  output_dir=$(dirname "$output")
  mkdir -p "$output_dir"
  
  # Run ffmpeg to optimize the video
  ffmpeg -y -i "$original" -c:v libx264 -crf 28 -an -movflags +faststart "$output" || {
    echo "Error processing $original. Skipping."
    rm -f "$output" 2>/dev/null
    continue
  }
  
  # Get optimized file size
  optimized_size=$(du -h "$output" | cut -f1)
  
  echo "✓ Optimized $original: $original_size → $optimized_size"
done

cd ..
echo ""
echo "Optimization complete! All videos have been optimized with '_optimized' suffix."
echo "If you're satisfied with the results, you can rename the optimized files to replace the originals."
