#!/bin/bash

# Script to map blob hashes to their original filenames from Git history

echo "Mapping blob hashes to filenames..."

# Create a mapping file
echo "Hash -> Filename mapping:" > hash_to_filename.txt

# Counter
count=0
total=$(wc -l < blob_hashes.txt)

while IFS= read -r hash; do
    count=$((count + 1))

    # Show progress every 50 hashes
    if (( count % 50 == 0 )); then
        echo "Processed $count/$total hashes..."
    fi

    # Find the filename for this hash from Git history
    # Get the most recent commit that contains this blob
    filename=$(git rev-list --all | xargs -n1 git ls-tree -r 2>/dev/null | grep "$hash" | head -1 | awk '{print $4}')

    if [ -n "$filename" ]; then
        echo "$hash -> $filename" >> hash_to_filename.txt
        echo "Mapped: $hash -> $filename"
    else
        echo "$hash -> NOT_FOUND" >> hash_to_filename.txt
        echo "No filename found for: $hash"
    fi
done < blob_hashes.txt

echo "Mapping complete! Results saved to hash_to_filename.txt"
echo "Total processed: $count hashes"