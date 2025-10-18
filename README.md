# Video Wall

A web-based application for displaying multiple YouTube live streams in a grid layout with interactive map visualization of video locations.

## Features

### 📺 Video Wall
- **2-column grid layout** for YouTube videos
- **Live stream support** with embedded YouTube players
- **Editable video titles** (click to edit inline)
- **Persistent storage** - videos saved between sessions
- **Auto-cropping** - videos fill their containers perfectly

### 🗺️ Interactive Map
- **Toggle between video and map views** using the globe/camera icon
- **Leaflet.js integration** with OpenStreetMap tiles
- **Geolocated video markers** on the map
- **Live video popups** - click markers to watch streams directly on the map
- **Auto-zoom** to fit all video locations
- **Real-time updates** when coordinates are modified

### 📍 Coordinate Support
- **Multiple coordinate formats** supported:
  - Decimal degrees: `40.7589, -73.9851`
  - DMS format: `40°45'33"N 73°59'07"W`
  - Alternative DMS: `N40°45'33" W73°59'07"`
- **Automatic normalization** to decimal degrees for mapping
- **Editable coordinates** via video edit modal

### 🎛️ Video Management
- **Add videos** by pasting YouTube URLs or video IDs
- **Edit video details** (title and coordinates) via edit button
- **Remove individual videos** or clear all at once
- **Real-time coordinate updates** reflected on map

## Quick Start

1. **Open** `index.html` in a web browser
2. **Add YouTube videos** by pasting URLs in the input field
3. **Edit coordinates** by clicking the pencil icon on any video
4. **View map** by clicking the globe icon in the top right
5. **Click map markers** to watch live streams in popups

## File Structure

```
videowall/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Core application logic and map integration
└── README.md           # This file
```

## Dependencies

- **Leaflet.js** - Interactive maps (loaded via CDN)
- **OpenStreetMap** - Map tiles
- **YouTube Embed API** - Video playback

## Browser Compatibility

- Modern browsers with ES6 support
- Tested on Chrome, Firefox, Safari, Edge
- Mobile responsive design

## Usage Examples

### Adding Videos
1. Paste any YouTube URL format:
   - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - `https://youtu.be/dQw4w9WgXcQ`
   - `dQw4w9WgXcQ` (video ID only)

### Setting Coordinates
1. Click the pencil (✏️) icon on any video
2. Enter coordinates in any supported format
3. Click "Save Changes"

### Map Navigation
1. Click the globe (🌍) icon to switch to map view
2. Click the camera (📹) icon to return to video grid
3. Click any marker to watch the live stream

## Technical Details

### Data Storage
- Uses `localStorage` for persistence
- Stores video metadata, coordinates, and normalized location data
- Automatic saving on all changes

### Coordinate Processing
- Intelligent parsing of multiple coordinate formats
- DMS to decimal degree conversion
- Error handling for invalid formats

### Map Integration
- Dynamic marker management
- Auto-fitting bounds for multiple locations
- Custom popup styling with embedded videos
- Real-time updates when coordinates change

### Video Features
- YouTube iframe embedding with optimized parameters
- Auto-muted playback in map popups
- Full video controls available
- Responsive scaling and cropping

## Keyboard Shortcuts

- **Enter** - Add video (when input field is focused)
- **Enter** - Save title edit (when editing video title)
- **Escape** - Cancel title edit

## Customization

### Styling
Modify `styles.css` to customize:
- Color scheme and themes
- Grid layout and video sizing
- Map popup appearance
- Button styles and animations

### Video Parameters
Adjust YouTube embed parameters in `script.js`:
- Autoplay settings
- Control visibility
- Related video suggestions
- Player branding

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Open source - feel free to use, modify, and distribute.

## Troubleshooting

### Videos Not Loading
- Check YouTube URL format
- Ensure videos are public and embeddable
- Verify internet connection

### Map Not Displaying
- Check browser console for JavaScript errors
- Ensure Leaflet.js CDN is accessible
- Verify coordinate format is valid

### Coordinates Not Saving
- Use supported coordinate formats
- Check browser localStorage permissions
- Ensure valid latitude/longitude ranges

## Credits

- **Leaflet.js** for mapping functionality
- **OpenStreetMap** for map tiles
- **YouTube** for video embedding capabilities
