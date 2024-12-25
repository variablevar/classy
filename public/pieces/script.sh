#!/bin/bash

# Base URL and output directory
BASE_URL="https://www.chess.com/chess-themes/pieces/neo/300"
OUTPUT_DIR="chess_pieces"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Arrays for colors and pieces
COLORS=("w" "b")  # 'w' for white, 'b' for black
PIECES=("k" "q" "p" "n" "b" "r")  # Chess pieces: king, queen, pawn, knight, bishop, rook

# Loop through colors and pieces to download images
for color in "${COLORS[@]}"; do
  for piece in "${PIECES[@]}"; do
    FILE_NAME="${color}${piece}.png"
    URL="${BASE_URL}/${FILE_NAME}"
    OUTPUT_PATH="${OUTPUT_DIR}/${FILE_NAME}"

    # Download the file
    echo "Downloading ${FILE_NAME}..."
    curl -s -o "$OUTPUT_PATH" "$URL"

    # Check if the download was successful
    if [ $? -eq 0 ]; then
      echo "Downloaded: ${FILE_NAME}"
    else
      echo "Failed to download: ${FILE_NAME}"
    fi
  done
done

echo "All downloads complete!"
