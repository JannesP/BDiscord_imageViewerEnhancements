//META{"name":"imageViewerEnhancements"}*//

var imageViewerEnhancements = function () {
    let that = this;
    let imageViewerVisible = false;
    let currentImage = -1;
    let links = [];

    that.convert = function () {
    };

    that.onMessage = function () {
    };
    that.onSwitch = function () {
    };
    that.start = function () {
        console.log("ImageViewer Enhancements loaded!")
    };
    that.load = function () {
    };
    that.unload = function () {
    };
    that.stop = function () {
    };
    that.getSettingsPanel = function () {
        return "";
    };

    that.getName = function () {
        return "ImageViewer Enhancements";
    };
    that.getDescription = function () {
        return "Enhances the standard image viewer with new features.";
    };
    that.getVersion = function () {
        return "0.1.0";
    };
    that.getAuthor = function () {
        return "DeppImAll";
    };

    that.observer = function (e) {
        if (e.addedNodes.length > 0 && e.addedNodes[0].className == 'callout-backdrop') {
            log("enhance:", e);
            imageViewerVisible = true;
            enhance();
        } else if (e.removedNodes.length > 0 && e.removedNodes[0].className == 'callout-backdrop') {
            log("dehance:", e);
            imageViewerVisible = false;
            dehance();
        }
    };

    let log = function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift("%c[" + that.getName() + "]", 'font-weight: bold;color: green;');
        console.log.apply(console, args);
    };

    let keyListener = function (e) {
        log("keycode: ", e.keyCode);
        if (e.keyCode === 65 || e.keyCode === 37) {	//left (a/left arrow)
            scrollLeft();
        } else if (e.keyCode === 68 || e.keyCode === 39) {	//right (d/right arrow)
            scrollRight();
        }
    };

    let scrollRight = function () {
        if (currentImage + 1 < links.length) {
            currentImage++;
            updateCurrentImage();
        }
    };

    let scrollLeft = function () {
        if (currentImage > 0) {
            currentImage--;
            updateCurrentImage();
        }
    };

    let updateCurrentImage = function () {
        log("currentImage: ", currentImage, "links: ", links[currentImage]);
        if (imageViewerVisible) {
            let newImg = document.createElement("img");
            let url = links[currentImage].discordUrl;
            if (url.indexOf("?width") != -1) {
                url = url.substr(0, url.indexOf("?width"));
            }
            newImg.src = url;
            $(".modal-image img, span.image.image-loading").remove();
            $(".modal-image").prepend(newImg);
            $(".modal-image a").attr("href", links[currentImage].sourceUrl);
            //document.getElementsByClassName('modal-image')[0].childNodes[1].setAttribute("href", links[currentImage].sourceUrl);
        }
    };

    let enhance = function () {
        let images = $("img.image, canvas");
        for (let i = 0; i < images.length; i++) {
            switch (images[i].tagName.toLowerCase()) {
                case "img":
                    links[i] = {"discordUrl": images[i].src, "sourceUrl": images[i].getAttribute("href")};
                    break;
                case "canvas":
                    let link = images[i].getAttribute("href");
                    links[i] = {"discordUrl": link, "sourceUrl": link};
                    break;
                default:
                    log("unknown element found: ", images[i]);
                    break;
            }
        }
        let currentSourceLink = document.getElementsByClassName('modal-image')[0].childNodes[1].getAttribute("href");
        for (let i = 0; i < links.length; i++) {
            if (links[i].sourceUrl === currentSourceLink) {
                currentImage = i;
                break;
            }
        }
        window.addEventListener("keydown", keyListener);
        log(images, links, "current link: ", currentSourceLink, "currImg: ", currentImage);
    };

    let dehance = function () {
        window.removeEventListener("keydown", keyListener);
        links = [];
        currentImage = -1;
    }

};