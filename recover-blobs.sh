#!/bin/bash

# Git Blob Recovery Script
# This script recovers all dangling blobs found by git fsck

echo "Starting blob recovery process..."
echo "Creating recovery directory..."

# Create recovery directory
mkdir -p recovered_blobs

# Counter for progress
count=0
total=$(grep -c . blob_hashes.txt)

echo "Processing $total blob hashes..."

# Read each hash from the file and recover it
while IFS= read -r hash; do
    count=$((count + 1))

    # Show progress every 10 blobs
    if (( count % 10 == 0 )); then
        echo "Processed $count/$total blobs..."
    fi

    # Try to recover the blob
    if git show "$hash" > "recovered_blobs/$hash.txt" 2>/dev/null; then
        echo "Recovered: $hash"
    else
        echo "Failed to recover: $hash" >&2
    fi

    # Alert how many files have been processed so far
    echo "Files processed so far: $count"
done < blob_hashes.txt

echo "Recovery complete! Files saved in recovered_blobs/ directory."
echo "Total processed: $count blobs"

# Create a summary
echo "Creating recovery summary..."
ls -la recovered_blobs/ | wc -l > recovered_blobs/summary.txt
echo "Total recovered files: $(cat recovered_blobs/summary.txt)" >> recovered_blobs/summary.txt
echo "Recovery summary saved to recovered_blobs/summary.txt"