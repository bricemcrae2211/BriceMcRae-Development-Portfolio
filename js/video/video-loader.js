
"use strict";

/* =========================================
   VIDEO LOADER
   js/video/video-loader.js

   Loads MP4 files directly from the
   website's videos folder.
========================================= */

const VIDEO_LOADER_CONFIG = {

    videos: {

        demoReel: {
            file: "../videos/demo-reel.mp4",
            reverse: true
        }

    }

};

class VideoLoader {

    static initialize() {

        document.querySelectorAll("[data-video]").forEach(video => {

            this.loadVideo(video);

        });

    }


    static loadVideo(video) {

        if (video.dataset.initialized === "true") {
            return;
        }

        const videoName = video.dataset.video;

        const config = VIDEO_LOADER_CONFIG.videos[videoName];

        if (!config) {

            this.setStatus(video, "Video configuration not found.");

            console.error("Video Loader: Unknown video:", videoName);

            return;

        }

        video.dataset.initialized = "true";

        const videoPath = new URL(
            config.file,
            document.baseURI
        ).href;

        console.log("Video Loader: Loading:", videoPath);

        this.setStatus(video, "Loading video...");

        video.addEventListener("loadedmetadata", () => {

            video.dataset.loaded = "true";

            this.setStatus(video, "");

            console.log(
                "Video Loader: Video loaded successfully.",
                videoPath
            );

            if (config.reverse) {

                this.setupReverse(video);

            }

        });

        video.addEventListener("canplay", () => {

            this.setStatus(video, "");

        });

        video.addEventListener("error", () => {

            const error = video.error;

            let message = "Unable to load video.";

            if (error) {

                switch (error.code) {

                    case MediaError.MEDIA_ERR_ABORTED:
                        message = "Video loading was cancelled.";
                        break;

                    case MediaError.MEDIA_ERR_NETWORK:
                        message = "Network error while loading video.";
                        break;

                    case MediaError.MEDIA_ERR_DECODE:
                        message = "Video format or encoding could not be decoded.";
                        break;

                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        message = "Video file not found or format not supported.";
                        break;

                }

            }

            video.dataset.loaded = "false";

            this.setStatus(video, message);

            console.error("Video Loader Error:", {
                message,
                path: video.currentSrc,
                errorCode: error?.code
            });

        });

        video.src = videoPath;

        video.load();

    }


    static setStatus(video, message) {

        const statusId = video.dataset.videoStatus;

        const status = statusId
            ? document.getElementById(statusId)
            : video.parentElement?.querySelector("[data-video-status]");

        if (status) {

            status.textContent = message;

            status.hidden = !message;

        }

    }


    /* =====================================
       REVERSE PLAYBACK
    ===================================== */

    static setupReverse(video) {

        const button = document.querySelector(
            `[data-video-reverse="${video.dataset.video}"]`
        );

        if (!button || button.dataset.initialized === "true") {
            return;
        }

        button.dataset.initialized = "true";

        button.addEventListener("click", () => {

            if (video.dataset.reversePlaying === "true") {

                video.dataset.reversePlaying = "false";

                button.textContent = "Play Backwards";

                return;

            }

            video.pause();

            if (video.currentTime <= 0) {

                video.currentTime = video.duration;

            }

            video.dataset.reversePlaying = "true";

            button.textContent = "Play Forwards";

            this.reverseFrame(video, button);

        });

    }


    static reverseFrame(video, button) {

        if (video.dataset.reversePlaying !== "true") {
            return;
        }

        if (video.currentTime <= 0) {

            video.currentTime = 0;

            video.dataset.reversePlaying = "false";

            button.textContent = "Play Backwards";

            return;

        }

        video.currentTime = Math.max(
            0,
            video.currentTime - 0.033
        );

        requestAnimationFrame(() => {

            this.reverseFrame(video, button);

        });

    }

}


/* =========================================
   START LOADER
========================================= */

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", () => {

        VideoLoader.initialize();

    });

} else {

    VideoLoader.initialize();

}
