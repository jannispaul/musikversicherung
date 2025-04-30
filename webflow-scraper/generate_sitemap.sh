#!/bin/bash

FOLDER_NAME=${1:-"dist"}
SITE_URL=${2:-"https://www.gentle-sage.nl"}
EXCLUDE_PATTERNS=${3:-""}  # Comma-separated list of patterns to exclude

generate_sitemap() {
    local folder="$1"
    local site_url="$2"
    local exclude_patterns="$3"
    local output_file="${folder}/sitemap.xml"

    # Create sitemap header
    cat > "$output_file" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOF

    # Find all HTML files and process them
    find "$folder" -type f -name "*.html" | while read -r file; do
        # Check if file should be excluded
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

        if [ "$skip" = false ]; then
            # Convert file path to URL
            relative_path=${file#"$folder/"}
            # Remove index.html from the end if present
            url_path=${relative_path%index.html}
            # Remove .html extension if present
            url_path=${url_path%.html}
            
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
}

# Execute the function with provided arguments
generate_sitemap "$FOLDER_NAME" "$SITE_URL" "$EXCLUDE_PATTERNS"