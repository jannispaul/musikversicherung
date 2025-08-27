#!/bin/bash
SITE_NAME="musikversicherung.webflow.io"
SITE_URL="https://${SITE_NAME}/"
ASSETS_DOMAIN="cdn.prod.website-files.com"
FOLDER_NAME="dist"
TARGET_ASSETS_DIR="./${FOLDER_NAME}/assets"
LIVE_URL="https://www.musikversicherung.com"
DISCOVER_URLS_FILE="./webflow-scraper/discover-urls.txt"

# Step 1: Clean up any previous runs
rm -rf $SITE_NAME https/ ${FOLDER_NAME}

# Step 2: Create target assets directory
mkdir -p "$TARGET_ASSETS_DIR"

# # Step 3.1: Download sitemap.xml 
# wget -q "${SITE_URL}sitemap.xml" -O "./${FOLDER_NAME}/sitemap.xml" && \
#   echo "Successfully downloaded sitemap.xml" || \
#   echo "Failed to download sitemap.xml"

# Step 3.2: Download the website
# --convert-links disabled to prevent conversion of links to local files
wget --mirror --adjust-extension --page-requisites --no-parent -nv \
  -H -D $SITE_NAME,$ASSETS_DOMAIN -e robots=off \
  --reject-regex '.*\?.*' \
  --user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36" \
  $SITE_URL 

# Step 3.3: Download additional URLs from discover-urls.txt if it exists
if [ -f "$DISCOVER_URLS_FILE" ]; then
  echo "Downloading additional URLs from $DISCOVER_URLS_FILE"
  while IFS= read -r url || [ -n "$url" ]; do
    # Skip empty lines or comments
    [[ -z "$url" || "$url" =~ ^# ]] && continue
    
    # Skip URLs with parameters
    if [[ "$url" == *"?"* ]]; then
      echo "Skipping URL with parameters: $url"
      continue
    fi
    
    echo "Downloading additional URL: $url"
    wget --adjust-extension --page-requisites --no-parent -nv \
      -H -D $SITE_NAME,$ASSETS_DOMAIN -e robots=off \
      --reject-regex '.*\?.*' \
      --user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36" \
      "$url"
  done < "$DISCOVER_URLS_FILE"
else
  echo "Warning: $DISCOVER_URLS_FILE not found. Continuing without additional URLs."
fi

# Step 4: Merge /musikversicherung.webflow.io into /dist
 if [ -d "${SITE_NAME}" ]; then
   cp -r ${SITE_NAME}/* ${FOLDER_NAME}/
   rm -rf ${SITE_NAME}
 fi

# Step 5: Move downloaded assets to the specified assets directory
if [ -d "./${ASSETS_DOMAIN}" ]; then
  mv -v "./${ASSETS_DOMAIN}"/* "$TARGET_ASSETS_DIR/"
  rm -rf "${ASSETS_DOMAIN}"
fi

# Step 6: Find the hex folder inside assets directory
ASSETS_HEX_DIR=$(find "$TARGET_ASSETS_DIR" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | head -n 1)
if [ -z "$ASSETS_HEX_DIR" ]; then
    echo "Error: Could not find hex directory in assets folder"
    exit 1
fi

# Create a temporary file to store processed OG images
PROCESSED_IMAGES="/tmp/processed_og_images.txt"
touch "$PROCESSED_IMAGES"

# Step 7: Download OG images from HTML files
find ./$FOLDER_NAME -type f -name "*.html" -exec sh -c '
  PROCESSED_IMAGES="'"$PROCESSED_IMAGES"'"
  TARGET_HEX_DIR="'"$TARGET_ASSETS_DIR/$ASSETS_HEX_DIR"'"
  for file do
    og_image=$(grep -o "<meta[^>]*og:image[^>]*>" "$file" | grep -o "content=\"[^\"]*\"" | cut -d"\"" -f2)
    if [ ! -z "$og_image" ]; then
      # Get the filename from the URL
      filename=$(basename "$og_image")
      
      # Check if we have already processed this image
      if ! grep -q "^$filename$" "$PROCESSED_IMAGES"; then
        if [[ "$og_image" == /* ]]; then
          # Handle relative URLs
          og_image="https://'"$SITE_NAME"'$og_image"
        elif [[ "$og_image" != http* ]]; then
          # Handle URLs without protocol
          og_image="https://$og_image"
        fi
        
        # Download the image to the hex directory
        wget -q "$og_image" -P "$TARGET_HEX_DIR" && {
          # Add the filename to processed images
          echo "$filename" >> "$PROCESSED_IMAGES"
          echo "Successfully downloaded: $filename"
        } || echo "Failed to download OG image: $og_image"
      fi
    fi
  done
' sh {} +

# Clean up the temporary file
rm -f "$PROCESSED_IMAGES"

# Loggin files to console
echo "Current directory: $(pwd)"
echo "Checking for HTML/CSS files in ./$FOLDER_NAME:"
find ./$FOLDER_NAME -type f \( -name "*.html" -or -name "*.css" \) -ls

# Step 8: Fix links in all HTML and CSS files
# wget --convert-links causes faulty "../cdn.prod.website-files.com" links
find ./$FOLDER_NAME -type f \( -name "*.html" -or -name "*.css" \) -exec sed -i "s|\.\./${ASSETS_DOMAIN}|/assets|g" {} \;
find ./$FOLDER_NAME -type f \( -name "*.html" -or -name "*.css" \) -exec sed -i "s|https://${ASSETS_DOMAIN}|/assets|g" {} \;


# Step 9: Fix relative path issues caused by "../cdn.prod.website-files.com"
# find  ./$FOLDER_NAME -type f \( -name "*.html" -or -name "*.css" \) -exec sed -i '' "s|\.\./cdn.prod.website-files.com|assets|g" {} \;
# find ./$FOLDER_NAME -type f \( -name "*.html" \) -exec sed -i '' -E "s|data-wf-[a-z]+=\"[^\"]+\""||g" {} \;

# Remove Webflow artifacts
# Remove JQUERY JS script
find ./$FOLDER_NAME -type f -name "*.html" -exec sed -i -E 's|<script[[:space:]]+[^>]*src="[^"]*\/js\/jquery[^"]*"[^>]*><\/script>||g' {} \;

# Remove Webflow data attributes
find ./$FOLDER_NAME -type f \( -name "*.html" \) -exec sed -i -E "s|data-wf-[a-z]+=\"[^\"]+\"||g" {} \;

# Remove Webflow JS script
find ./$FOLDER_NAME -type f -name "*.html" -exec sed -i -E 's|<script src="/assets/[^/]+/js/webflow\.[^.]+(\.[^.]+)*\.js" type="text/javascript"></script>||g' {} \;


# Step 10: Fix CSS and JS compressed file references
find ./$FOLDER_NAME -type f \( -name "*.html" \) -exec sed -i "s|.css.gz|.css|g" {} \;
find ./$FOLDER_NAME -type f \( -name "*.html" \) -exec sed -i "s|.js.gz|.js|g" {} \;

# Step 11: Clean up redundant directories
rm -rf https/
echo "Download completed successfully! Generating sitemap now..."

# Generate sitemap
# You can specify patterns to exclude, e.g.: "404.html,private,temp"
./webflow-scraper/generate_sitemap.sh "$FOLDER_NAME" "$LIVE_URL" "404.html,thank-you"

echo "Sitemap generation completed successfully! Running rest of github action now to commit files to repo..."