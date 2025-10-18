class VideoWall {
    constructor() {
        this.videoCounter = 0;
        this.videos = [];
        this.map = null;
        this.mapMarkers = [];
        this.isMapView = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateGridLayout();
        this.loadSavedVideos();
    }

    bindEvents() {
        // Add YouTube button
        document.getElementById('addYoutubeBtn').addEventListener('click', () => {
            this.addYouTubeVideo();
        });

        // Clear all button
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAll();
        });

        // Enter key for YouTube input
        document.getElementById('youtubeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addYouTubeVideo();
            }
        });

        // Map toggle button
        document.getElementById('mapToggleBtn').addEventListener('click', () => {
            this.toggleMap();
        });
    }

    addYouTubeVideo() {
        const input = document.getElementById('youtubeInput');
        const url = input.value.trim();
        
        if (!url) {
            this.showError('Please enter a YouTube URL');
            return;
        }

        const videoId = this.extractYouTubeId(url);
        if (!videoId) {
            this.showError('Invalid YouTube URL. Please check the format.');
            return;
        }

        this.videoCounter++;
        const itemId = `video-${this.videoCounter}`;
        
        const videoItem = this.createVideoItem({
            id: itemId,
            title: `YouTube Video ${this.videoCounter}`,
            type: 'youtube',
            youtubeId: videoId
        });

        this.videos.push({
            id: itemId,
            type: 'youtube',
            youtubeId: videoId,
            element: videoItem,
            coordinates: '',
            normalizedCoords: null
        });

        this.addVideoToGrid(videoItem);
        this.updateGridLayout();
        this.saveVideos();
        
        // Clear input
        input.value = '';
    }

    extractYouTubeId(url) {
        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    createVideoItem({ id, title, type, youtubeId }) {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.dataset.id = id;

        const header = document.createElement('div');
        header.className = 'video-header';
        
        const titleElement = document.createElement('span');
        titleElement.className = 'video-title';
        titleElement.textContent = title;
        titleElement.contentEditable = true;
        titleElement.addEventListener('blur', () => {
            this.saveVideos();
        });
        titleElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                titleElement.blur();
            }
        });

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit video details';
        editBtn.addEventListener('click', () => {
            this.editVideo(id);
        });

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => {
            this.removeVideo(id);
        });

        header.appendChild(titleElement);
        header.appendChild(editBtn);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'video-content';

        if (type === 'youtube') {
            this.setupYouTubeContent(content, youtubeId);
        }

        videoItem.appendChild(header);
        videoItem.appendChild(content);

        return videoItem;
    }

    setupYouTubeContent(container, videoId) {
        // Show loading state
        container.innerHTML = '<div class="loading">Loading YouTube video...</div>';

        // Create YouTube iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'youtube-iframe';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&start=0&t=0`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Replace loading with iframe after a short delay
        setTimeout(() => {
            container.innerHTML = '';
            container.appendChild(iframe);
        }, 500);
    }

    addVideoToGrid(videoItem) {
        const grid = document.getElementById('videoGrid');
        
        // Remove empty state if it exists
        const emptyState = grid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        grid.appendChild(videoItem);
    }

    removeVideo(videoId) {
        const videoIndex = this.videos.findIndex(v => v.id === videoId);
        if (videoIndex === -1) return;

        const video = this.videos[videoIndex];
        
        // Remove from DOM
        video.element.remove();
        
        // Remove from array
        this.videos.splice(videoIndex, 1);

        this.updateGridLayout();
        this.saveVideos();
        
        // Show empty state if no videos left
        if (this.videos.length === 0) {
            this.showEmptyState();
        }
    }

    clearAll() {
        // Remove all videos
        this.videos.forEach(video => {
            video.element.remove();
        });

        this.videos = [];
        this.videoCounter = 0;
        this.updateGridLayout();
        this.saveVideos();
        this.showEmptyState();
    }

    updateGridLayout() {
        // Grid now uses fixed layout with scrolling
        // No dynamic classes needed
    }

    showEmptyState() {
        const grid = document.getElementById('videoGrid');
        if (grid.children.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h2>Welcome to Video Wall</h2>
                    <p>Add YouTube videos to get started!</p>
                    <div class="instructions">
                        <div class="instruction">
                            <strong>📺 Add YouTube:</strong> Paste any YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                        </div>
                    </div>
                </div>
            `;
        }
    }

    editVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;

        const title = video.element.querySelector('.video-title').textContent;
        
        this.showEditModal({
            id: videoId,
            title: title,
            coordinates: video.coordinates || ''
        });
    }

    showEditModal(videoData) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.edit-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        
        // Create modal structure
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `
            <h3>Edit Video Details</h3>
            <button class="modal-close">×</button>
        `;
        
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        const titleGroup = document.createElement('div');
        titleGroup.className = 'form-group';
        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'editTitle');
        titleLabel.textContent = 'Title:';
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'editTitle';
        titleInput.value = videoData.title;
        titleInput.placeholder = 'Video title';
        titleGroup.appendChild(titleLabel);
        titleGroup.appendChild(titleInput);
        
        const coordGroup = document.createElement('div');
        coordGroup.className = 'form-group';
        const coordLabel = document.createElement('label');
        coordLabel.setAttribute('for', 'editCoordinates');
        coordLabel.textContent = 'Coordinates:';
        const coordInput = document.createElement('input');
        coordInput.type = 'text';
        coordInput.id = 'editCoordinates';
        coordInput.value = videoData.coordinates;
        coordInput.placeholder = 'e.g., 40°45\'33"N 73°59\'07"W';
        coordGroup.appendChild(coordLabel);
        coordGroup.appendChild(coordInput);
        
        body.appendChild(titleGroup);
        body.appendChild(coordGroup);
        
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        footer.innerHTML = `
            <button class="btn-secondary modal-cancel">Cancel</button>
            <button class="btn-primary modal-save">Save Changes</button>
        `;
        
        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        
        modal.appendChild(backdrop);
        modal.appendChild(content);

        document.body.appendChild(modal);

        // Event listeners
        const closeModal = () => modal.remove();
        
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
        
        modal.querySelector('.modal-save').addEventListener('click', () => {
            this.saveVideoEdits(videoData.id, {
                title: modal.querySelector('#editTitle').value,
                coordinates: modal.querySelector('#editCoordinates').value
            });
            closeModal();
        });

        // Focus on title input
        setTimeout(() => {
            modal.querySelector('#editTitle').focus();
        }, 100);
    }

    normalizeCoordinates(coordString) {
        if (!coordString || !coordString.trim()) return null;

        const coord = coordString.trim();
        
        // Try to parse decimal degrees first (e.g., "40.7589, -73.9851")
        const decimalMatch = coord.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
        if (decimalMatch) {
            return {
                lat: parseFloat(decimalMatch[1]),
                lng: parseFloat(decimalMatch[2]),
                original: coord
            };
        }

        // Parse DMS format (e.g., "40°45'33"N 73°59'07"W")
        const dmsPattern = /(\d+)°(\d+)'(\d+(?:\.\d+)?)"?\s*([NSEW])\s*(\d+)°(\d+)'(\d+(?:\.\d+)?)"?\s*([NSEW])/;
        const dmsMatch = coord.match(dmsPattern);
        
        if (dmsMatch) {
            const [, deg1, min1, sec1, dir1, deg2, min2, sec2, dir2] = dmsMatch;
            
            // Convert DMS to decimal degrees
            const lat = this.dmsToDecimal(parseInt(deg1), parseInt(min1), parseFloat(sec1), dir1);
            const lng = this.dmsToDecimal(parseInt(deg2), parseInt(min2), parseFloat(sec2), dir2);
            
            return {
                lat: lat,
                lng: lng,
                original: coord
            };
        }

        // Try to parse other common formats
        // Handle formats like "N40°45'33" W73°59'07""
        const altDmsPattern = /([NSEW])(\d+)°(\d+)'(\d+(?:\.\d+)?)"?\s*([NSEW])(\d+)°(\d+)'(\d+(?:\.\d+)?)"?/;
        const altDmsMatch = coord.match(altDmsPattern);
        
        if (altDmsMatch) {
            const [, dir1, deg1, min1, sec1, dir2, deg2, min2, sec2] = altDmsMatch;
            
            const lat = this.dmsToDecimal(parseInt(deg1), parseInt(min1), parseFloat(sec1), dir1);
            const lng = this.dmsToDecimal(parseInt(deg2), parseInt(min2), parseFloat(sec2), dir2);
            
            return {
                lat: lat,
                lng: lng,
                original: coord
            };
        }

        return null; // Could not parse
    }

    dmsToDecimal(degrees, minutes, seconds, direction) {
        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        
        // Apply negative sign for South and West
        if (direction === 'S' || direction === 'W') {
            decimal = -decimal;
        }
        
        return decimal;
    }

    saveVideoEdits(videoId, editData) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;

        // Normalize coordinates
        const normalizedCoords = this.normalizeCoordinates(editData.coordinates);
        
        // Update video data
        video.coordinates = editData.coordinates;
        video.normalizedCoords = normalizedCoords;

        // Update title in DOM
        const titleElement = video.element.querySelector('.video-title');
        titleElement.textContent = editData.title;

        // Save to localStorage
        this.saveVideos();

        // Update map markers if map is currently visible
        if (this.isMapView && this.map) {
            this.updateMapMarkers();
        }

        // Show normalized coordinates in console for debugging
        if (normalizedCoords) {
            console.log(`Normalized coordinates: ${normalizedCoords.lat}, ${normalizedCoords.lng}`);
        }
    }

    showError(message) {
        // Create a temporary error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    saveVideos() {
        const videoData = this.videos.map(video => ({
            id: video.id,
            type: video.type,
            youtubeId: video.youtubeId,
            title: video.element.querySelector('.video-title').textContent,
            coordinates: video.coordinates || '',
            normalizedCoords: video.normalizedCoords || null
        }));
        
        localStorage.setItem('videoWallVideos', JSON.stringify(videoData));
        localStorage.setItem('videoWallCounter', this.videoCounter.toString());
    }

    loadSavedVideos() {
        const savedVideos = localStorage.getItem('videoWallVideos');
        const savedCounter = localStorage.getItem('videoWallCounter');
        
        if (savedCounter) {
            this.videoCounter = parseInt(savedCounter, 10);
        }
        
        if (savedVideos) {
            try {
                const videoData = JSON.parse(savedVideos);
                
                videoData.forEach(data => {
                    if (data.type === 'youtube' && data.youtubeId) {
                        const videoItem = this.createVideoItem({
                            id: data.id,
                            title: data.title,
                            type: 'youtube',
                            youtubeId: data.youtubeId
                        });

                        this.videos.push({
                            id: data.id,
                            type: 'youtube',
                            youtubeId: data.youtubeId,
                            element: videoItem,
                            coordinates: data.coordinates || '',
                            normalizedCoords: data.normalizedCoords || null
                        });

                        this.addVideoToGrid(videoItem);
                    }
                });
                
                this.updateGridLayout();
                
                // Don't show empty state if we loaded videos
                if (this.videos.length === 0) {
                    this.showEmptyState();
                }
                
            } catch (error) {
                console.error('Error loading saved videos:', error);
                this.showEmptyState();
            }
        } else {
            this.showEmptyState();
        }
    }

    toggleMap() {
        const toggleBtn = document.getElementById('mapToggleBtn');
        const videoGrid = document.getElementById('videoGrid');
        const mapView = document.getElementById('mapView');
        
        if (this.isMapView) {
            // Switch to video view
            this.isMapView = false;
            videoGrid.style.display = 'grid';
            mapView.style.display = 'none';
            toggleBtn.innerHTML = '🌍';
            toggleBtn.title = 'Show Map View';
        } else {
            // Switch to map view
            this.isMapView = true;
            videoGrid.style.display = 'none';
            mapView.style.display = 'flex';
            toggleBtn.innerHTML = '📹';
            toggleBtn.title = 'Show Video View';
            
            // Initialize map if not already done, but wait for the container to be visible
            setTimeout(() => {
                if (!this.map) {
                    this.initializeMap();
                } else {
                    // Map exists, just resize it
                    this.map.invalidateSize();
                }
                
                // Update markers
                this.updateMapMarkers();
            }, 50);
        }
    }

    initializeMap() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([40.7128, -74.0060], 2); // Default to NYC, zoom level 2 for world view
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Ensure map renders properly
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    updateMapMarkers() {
        if (!this.map) return;
        
        // Clear existing markers
        this.mapMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.mapMarkers = [];
        
        // Get videos with normalized coordinates
        const geolocatedVideos = this.videos.filter(video => 
            video.normalizedCoords && 
            video.normalizedCoords.lat && 
            video.normalizedCoords.lng
        );
        
        if (geolocatedVideos.length === 0) {
            return;
        }
        
        // Add markers for each video
        geolocatedVideos.forEach(video => {
            const { lat, lng } = video.normalizedCoords;
            const title = video.element.querySelector('.video-title').textContent;
            
            // Create custom marker with video icon
            const marker = L.marker([lat, lng]).addTo(this.map);
            
            // Create popup with live video embed only
            const popupContent = `
                <div style="width: 420px; height: 240px; border-radius: 6px; overflow: hidden; background: #000;">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0"
                        style="width: 100%; height: 100%; border: none;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            
            // Create popup with custom styling
            const popup = L.popup({
                maxWidth: 440,
                className: 'video-popup'
            }).setContent(popupContent);
            
            marker.bindPopup(popup);
            this.mapMarkers.push(marker);
        });
        
        // Auto-fit map to show all markers
        if (geolocatedVideos.length === 1) {
            // Single marker - zoom to it
            const { lat, lng } = geolocatedVideos[0].normalizedCoords;
            this.map.setView([lat, lng], 10);
        } else if (geolocatedVideos.length > 1) {
            // Multiple markers - fit bounds
            const group = new L.featureGroup(this.mapMarkers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
        
        // Ensure map renders properly
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }
}

// Initialize the video wall when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VideoWall();
});

// Handle page unload - cleanup no longer needed for webcams
window.addEventListener('beforeunload', () => {
    // No cleanup needed for YouTube videos
});