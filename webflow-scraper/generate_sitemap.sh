#!/bin/bash

FOLDER_NAME=${1:-"dist"}
SITE_URL=${2:-"https://www.musikversicherung.com"}
EXCLUDE_PATTERNS=${3:-""}  # Comma-separated list of patterns to exclude
NOINDEX_FILE="/webflow-scraper/sitemap-noindex.txt"  # File containing paths to exclude

generate_sitemap() {
    local folder="$1"
    local site_url="$2"
    local exclude_patterns="$3"
    local output_file="${folder}/sitemap.xml"
    local noindex_file="$NOINDEX_FILE"
    local noindex_paths=()

    # Read sitemap-noindex.txt if it exists
    if [ -f "$noindex_file" ]; then
        while IFS= read -r line || [ -n "$line" ]; do
            # Skip empty lines and comments
            if [ -n "$line" ] && [[ ! "$line" =~ ^[[:space:]]*# ]]; then
                # Remove any carriage returns that might be present (for Windows compatibility)
                clean_line=$(echo "$line" | tr -d '\r')
                noindex_paths+=("$clean_line")
            fi
        done < "$noindex_file"
        echo "Loaded ${#noindex_paths[@]} paths to exclude from $noindex_file"
    fi

    # Create sitemap header
    cat > "$output_file" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOF

    # Find all HTML files and process them
    find "$folder" -type f -name "*.html" | while read -r file; do
        # Check if file should be excluded based on patterns
        skip=false
        if [ ! -z "$exclude_patterns" ]; then
            IFS=',' read -ra PATTERNS <<< "$exclude_patterns"
            for pattern in "${PATTERNS[@]}"; do
                if [[ "$file" =~ $pattern ]]; then
                    skip=true
                    break
                fi
            done
        fi

        # Convert file path to URL for noindex check
        relative_path=${file#"$folder/"}
        # Remove index.html from the end if present
        url_path=${relative_path%index.html}
        # Remove .html extension if present
        url_path=${url_path%.html}
        # Normalize the URL path (remove leading/trailing slashes)
        normalized_url_path=$(echo "$url_path" | sed 's:^/::' | sed 's:/$::')

        # Check if path is in noindex list
        for noindex_path in "${noindex_paths[@]}"; do
            # Normalize the noindex path (remove leading/trailing slashes)
            normalized_noindex_path=$(echo "$noindex_path" | sed 's:^/::' | sed 's:/$::')
            
            # Debug: Print paths (uncomment if needed for debugging)
            # echo "Checking: '$normalized_url_path' against noindex: '$normalized_noindex_path'"
            
            # Check for exact match or if URL path starts with noindex path followed by /
            if [ "$normalized_url_path" = "$normalized_noindex_path" ] || [[ "$normalized_url_path" = "$normalized_noindex_path"/* ]]; then
                skip=true
                # Uncomment for debugging: echo "Excluded: $url_path"
                break
            fi
        done

        if [ "$skip" = false ]; then
            # Get last modified date in W3C format
            last_mod=$(date -r "$file" "+%Y-%m-%d")

            # Add entry to sitemap
            cat >> "$output_file" << EOF
    <url>
        <loc>${site_url}/${url_path}</loc>
        <lastmod>${last_mod}</lastmod>
    </url>
EOF
        fi
    done

    # Close sitemap
    echo "</urlset>" >> "$output_file"

    echo "Sitemap generated at $output_file"
    if [ -f "$noindex_file" ] && [ ${#noindex_paths[@]} -gt 0 ]; then
        echo "Excluded paths from $noindex_file: ${#noindex_paths[@]}"
        echo "Excluded paths: ${noindex_paths[*]}"
    fi
}

# Execute the function with provided arguments
generate_sitemap "$FOLDER_NAME" "$SITE_URL" "$EXCLUDE_PATTERNS"