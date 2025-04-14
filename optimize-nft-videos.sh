#!/bin/bash

# Script to optimize NFT videos for web loading
# - Removes audio
# - Reduces resolution to 720px (maintaining aspect ratio)
# - Uses H.264 encoding with CRF 23
# - Adds faststart flag for better web streaming

echo "Starting NFT video optimization..."
echo "This will overwrite the original files. Make sure you have backups if needed."
echo ""

# Change to the videos directory
cd videos || { echo "Error: videos directory not found"; exit 1; }

# Count total NFT videos
total=$(ls NFT_*.mp4 2>/dev/null | wc -l)
if [ "$total" -eq 0 ]; then
  echo "No NFT videos found in the videos directory."
  exit 1
fi

echo "Found $total NFT videos to process."
echo ""

# Process each NFT video
count=0
for original in NFT_*.mp4; do
  count=$((count + 1))
  echo "[$count/$total] Processing $original..."
  
  # Get original file size
  original_size=$(du -h "$original" | cut -f1)
  
  # Create a temporary output file
  temp_output="temp_${original}"
  
  # Run ffmpeg to optimize the video
  ffmpeg -y -i "$original" -c:v libx264 -crf 23 -vf "scale=min(720\,iw):min(720\,ih):force_original_aspect_ratio=1" -an -movflags +faststart "$temp_output" || {
    echo "Error processing $original. Skipping."
    rm -f "$temp_output" 2>/dev/null
    continue
  }
  
  # Get optimized file size
  optimized_size=$(du -h "$temp_output" | cut -f1)
  
  # Replace the original file with the optimized version
  mv "$temp_output" "$original"
  
  echo "✓ Optimized $original: $original_size → $optimized_size"
done

cd ..
echo ""
echo "Optimization complete! All $count NFT videos have been optimized."
