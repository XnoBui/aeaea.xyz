#!/bin/bash

# Script to optimize aeaea-intro.mov for web loading
# - Converts from H.265 MOV to H.264 MP4
# - Maintains original resolution (1920x810)
# - Removes audio (not needed for muted autoplay)
# - Uses CRF 28 for conservative compression
# - Adds faststart flag for progressive loading

echo "Starting aeaea-intro.mov optimization..."
echo "Converting to web-optimized MP4 format..."
echo ""

# Change to the videos directory
cd videos || { echo "Error: videos directory not found"; exit 1; }

# Check if source file exists
if [ ! -f "aeaea-intro.mov" ]; then
  echo "Error: aeaea-intro.mov not found in videos directory"
  exit 1
fi

# Get original file size
original_size=$(du -h "aeaea-intro.mov" | cut -f1)
echo "Original file size: $original_size"

# Create optimized MP4 version
echo "Optimizing video..."
ffmpeg -y -i "aeaea-intro.mov" \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -an \
  -movflags +faststart \
  -pix_fmt yuv420p \
  "aeaea-intro.mp4" || {
    echo "Error: Failed to optimize video"
    exit 1
  }

# Get optimized file size
optimized_size=$(du -h "aeaea-intro.mp4" | cut -f1)

# Calculate compression ratio
original_bytes=$(stat -f%z "aeaea-intro.mov" 2>/dev/null || stat -c%s "aeaea-intro.mov")
optimized_bytes=$(stat -f%z "aeaea-intro.mp4" 2>/dev/null || stat -c%s "aeaea-intro.mp4")
compression_ratio=$(echo "scale=1; (1 - $optimized_bytes / $original_bytes) * 100" | bc -l 2>/dev/null || echo "N/A")

echo ""
echo "✓ Optimization complete!"
echo "Original:  $original_size (aeaea-intro.mov)"
echo "Optimized: $optimized_size (aeaea-intro.mp4)"
if [ "$compression_ratio" != "N/A" ]; then
  echo "Size reduction: ${compression_ratio}%"
fi

# Remove original MOV file
echo ""
echo "Removing original MOV file..."
rm "aeaea-intro.mov"
echo "✓ Original file removed"

cd ..
echo ""
echo "Optimization complete! The video is now web-optimized."
echo "Remember to update HTML references from .mov to .mp4"
