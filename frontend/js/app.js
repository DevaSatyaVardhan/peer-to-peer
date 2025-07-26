// Peer Learning Platform - Main JavaScript File

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Global Variables
let currentVideoId = null;
let currentStudentRollNumber = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Peer Learning Platform initialized');
    
    // Load all videos on page load
    loadAllVideos();
    
    // Load platform statistics
    loadPlatformStatistics();
    
    // Add event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchVideos();
            }
        });
    }
    
    // Comment input enter key
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addComment();
            }
        });
    }
}

// Modal Functions
function showRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function showUploadModal() {
    const modal = new bootstrap.Modal(document.getElementById('uploadModal'));
    modal.show();
}

function showVideoModal(videoId) {
    currentVideoId = videoId;
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    modal.show();
    
    // Load video details
    loadVideoDetails(videoId);
    loadComments(videoId);
}

// API Functions
async function registerStudent() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        department: document.getElementById('department').value,
        rollNumber: document.getElementById('rollNumber').value,
        email: document.getElementById('email').value
    };
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/students/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Registration successful! You can now upload videos.', 'success');
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            document.getElementById('registrationForm').reset();
            
            // Refresh statistics
            loadPlatformStatistics();
        } else {
            showAlert(result.message || 'Registration failed', 'danger');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'danger');
    } finally {
        hideLoading();
    }
}

async function uploadVideo() {
    const formData = {
        title: document.getElementById('videoTitle').value,
        description: document.getElementById('videoDescription').value,
        department: document.getElementById('videoDepartment').value,
        subject: document.getElementById('videoSubject').value,
        videoUrl: document.getElementById('videoUrl').value,
        studentRollNumber: document.getElementById('uploaderRollNumber').value
    };
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/videos/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Video uploaded successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
            document.getElementById('uploadForm').reset();
            
            // Reload videos and refresh statistics
            loadAllVideos();
            loadPlatformStatistics();
        } else {
            showAlert(result.message || 'Upload failed', 'danger');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Upload failed. Please try again.', 'danger');
    } finally {
        hideLoading();
    }
}

async function loadAllVideos() {
    try {
        showLoading();
        
        // Load videos from all departments
        const departments = ['CSE', 'ECE', 'EIE', 'Civil', 'Mechanical'];
        let allVideos = [];
        
        for (const dept of departments) {
            const response = await fetch(`${API_BASE_URL}/videos/department/${dept}`);
            const result = await response.json();
            
            if (result.success && result.videos) {
                allVideos = allVideos.concat(result.videos);
            }
        }
        
        // Sort by upload date (newest first)
        allVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        
        displayVideos(allVideos);
    } catch (error) {
        console.error('Load videos error:', error);
        showAlert('Failed to load videos', 'danger');
    } finally {
        hideLoading();
    }
}

async function loadVideosByDepartment(department) {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/videos/department/${department}`);
        const result = await response.json();
        
        if (result.success) {
            displayVideos(result.videos);
        } else {
            showAlert(result.message || 'Failed to load videos', 'danger');
        }
    } catch (error) {
        console.error('Load videos error:', error);
        showAlert('Failed to load videos', 'danger');
    } finally {
        hideLoading();
    }
}

async function searchVideos() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        loadAllVideos();
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/videos/search?subject=${encodeURIComponent(searchTerm)}`);
        const result = await response.json();
        
        if (result.success) {
            displayVideos(result.videos);
        } else {
            showAlert(result.message || 'Search failed', 'danger');
        }
    } catch (error) {
        console.error('Search error:', error);
        showAlert('Search failed', 'danger');
    } finally {
        hideLoading();
    }
}

async function loadVideoDetails(videoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}`);
        const result = await response.json();
        
        if (result.success) {
            const video = result.video;
            document.getElementById('videoModalTitle').textContent = video.title;
            
            // Convert URL to embed format
            const embedInfo = convertToEmbedUrl(video.videoUrl);
            const videoFrame = document.getElementById('videoFrame');
            
            if (embedInfo.type === 'youtube' || embedInfo.type === 'gdrive') {
                videoFrame.outerHTML = `<iframe id="videoFrame" width="100%" height="315" src="${embedInfo.embedUrl}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                videoFrame.outerHTML = `<video id="videoFrame" width="100%" height="315" src="${video.videoUrl}" controls></video>`;
            }
            
            document.getElementById('videoDepartmentBadge').textContent = video.department;
            document.getElementById('videoSubjectBadge').textContent = video.subject;
            document.getElementById('videoDescription').textContent = video.description || 'No description available';
            document.getElementById('uploaderName').textContent = video.uploaderName;
            document.getElementById('uploadDate').textContent = formatDate(video.uploadDate);
            document.getElementById('viewCount').textContent = video.viewCount || 0;
            loadLikeCount(videoId);
            const rollNumber = document.getElementById('commenterRollNumber').value;
            if (rollNumber) {
                checkIfLiked(videoId, rollNumber);
            }
        }
    } catch (error) {
        console.error('Load video details error:', error);
    }
}

async function loadLikeCount(videoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}/likes`);
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('likeCount').textContent = result.count;
        }
    } catch (error) {
        console.error('Load like count error:', error);
    }
}

async function checkIfLiked(videoId, studentRollNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}/likes/check?studentRollNumber=${studentRollNumber}`);
        const result = await response.json();
        
        const likeButton = document.getElementById('likeButton');
        if (result.hasLiked) {
            likeButton.classList.add('liked');
        } else {
            likeButton.classList.remove('liked');
        }
    } catch (error) {
        console.error('Check like status error:', error);
    }
}

async function likeVideo() {
    const studentRollNumber = document.getElementById('commenterRollNumber').value;
    
    if (!studentRollNumber) {
        showAlert('Please enter your roll number to like videos', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${currentVideoId}/likes?studentRollNumber=${studentRollNumber}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update like button
            const likeButton = document.getElementById('likeButton');
            likeButton.classList.add('liked');
            
            // Update like count
            loadLikeCount(currentVideoId);
            
            showAlert('Video liked successfully!', 'success');
        } else {
            showAlert(result.message || 'Failed to like video', 'danger');
        }
    } catch (error) {
        console.error('Like video error:', error);
        showAlert('Failed to like video', 'danger');
    }
}

async function loadComments(videoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`);
        const result = await response.json();
        
        const commentsContainer = document.getElementById('commentsContainer');
        
        if (result.success && result.comments) {
            commentsContainer.innerHTML = result.comments.map(comment => `
                <div class="comment-item fade-in">
                    <div class="comment-author">${comment.uploaderName || (comment.student ? comment.student.fullName : '')}</div>
                    <div class="comment-date">${formatDate(comment.commentDate)}</div>
                    <div class="comment-text">${comment.commentText}</div>
                </div>
            `).join('');
        } else {
            commentsContainer.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
        }
    } catch (error) {
        console.error('Load comments error:', error);
        document.getElementById('commentsContainer').innerHTML = '<p class="text-danger">Failed to load comments</p>';
    }
}

async function addComment() {
    const commentText = document.getElementById('commentInput').value.trim();
    const studentRollNumber = document.getElementById('commenterRollNumber').value;
    
    if (!commentText) {
        showAlert('Please enter a comment', 'warning');
        return;
    }
    
    if (!studentRollNumber) {
        showAlert('Please enter your roll number to comment', 'warning');
        return;
    }
    
    try {
        const formData = {
            commentText: commentText,
            studentRollNumber: studentRollNumber
        };
        
        const response = await fetch(`${API_BASE_URL}/videos/${currentVideoId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear comment input
            document.getElementById('commentInput').value = '';
            
            // Reload comments
            loadComments(currentVideoId);
            
            showAlert('Comment added successfully!', 'success');
        } else {
            showAlert(result.message || 'Failed to add comment', 'danger');
        }
    } catch (error) {
        console.error('Add comment error:', error);
        showAlert('Failed to add comment', 'danger');
    }
}

// Display Functions
function displayVideos(videos) {
    const container = document.getElementById('videosContainer');
    
    if (!videos || videos.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-video fa-3x text-muted mb-3"></i>
                        <h5>No videos found</h5>
                        <p class="text-muted">Be the first to upload a video!</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = videos.map(video => {
        // Convert URL to embed format
        const embedInfo = convertToEmbedUrl(video.videoUrl);
        
        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="video-card fade-in" onclick="showVideoModal(${video.id})">
                <div class="video-thumbnail">
                    ${embedInfo.thumbnailUrl ? `<img src="${embedInfo.thumbnailUrl}" alt="Video Thumbnail" class="img-fluid"/>` : `<video src="${video.videoUrl}" class="img-fluid" controls style="display:none"></video>`}
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h6 class="video-title">${video.title}</h6>
                    <div class="video-meta">
                        <span class="badge bg-primary me-2">${video.department}</span>
                        <span class="badge bg-secondary">${video.subject}</span>
                    </div>
                    <p class="text-muted small">${video.description ? video.description.substring(0, 100) + '...' : 'No description'}</p>
                    <div class="video-stats">
                        <small class="text-muted">
                            <i class="fas fa-user me-1"></i>${video.uploaderName}
                        </small>
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>${formatDate(video.uploadDate)}
                        </small>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Utility Functions
function convertToEmbedUrl(url) {
    // Handle YouTube URLs
    const ytMatch = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/(?:www\.)?youtu\.be\/)([\w-]{11})/);
    if (ytMatch) {
        const videoId = ytMatch[1];
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            type: 'youtube'
        };
    }
    
    // Handle Google Drive URLs
    const gdMatch = url.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (gdMatch) {
        const fileId = gdMatch[1];
        return {
            embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
            thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
            type: 'gdrive'
        };
    }
    
    // Handle other video URLs
    return {
        embedUrl: url,
        thumbnailUrl: null,
        type: 'other'
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('videosContainer');
    if (spinner) spinner.style.display = 'block';
    if (container) container.style.display = 'none';
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('videosContainer');
    if (spinner) spinner.style.display = 'none';
    if (container) container.style.display = 'block';
}

function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Statistics Functions
async function loadPlatformStatistics() {
    try {
        // Load student count
        const studentResponse = await fetch(`${API_BASE_URL}/students/count`);
        const studentResult = await studentResponse.json();
        
        if (studentResult.success) {
            document.getElementById('studentCount').textContent = studentResult.totalStudents;
        }
        
        // Load video count (we'll calculate this from all videos)
        const departments = ['CSE', 'ECE', 'EIE', 'Civil', 'Mechanical'];
        let totalVideos = 0;
        
        for (const dept of departments) {
            const videoResponse = await fetch(`${API_BASE_URL}/videos/department/${dept}`);
            const videoResult = await videoResponse.json();
            
            if (videoResult.success && videoResult.videos) {
                totalVideos += videoResult.videos.length;
            }
        }
        
        document.getElementById('videoCount').textContent = totalVideos;
        
    } catch (error) {
        console.error('Load statistics error:', error);
        // Don't show alert for statistics loading failure
    }
}

// Export functions for global access
window.showRegisterModal = showRegisterModal;
window.showUploadModal = showUploadModal;
window.showVideoModal = showVideoModal;
window.registerStudent = registerStudent;
window.uploadVideo = uploadVideo;
window.loadVideosByDepartment = loadVideosByDepartment;
window.loadAllVideos = loadAllVideos;
window.searchVideos = searchVideos;
window.likeVideo = likeVideo;
window.addComment = addComment;