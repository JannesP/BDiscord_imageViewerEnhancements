//META{"name":"imageViewerEnhancements"}*//

var imageViewerEnhancements = function () {
    let that = this;
    const DEBUG = true;
    let imageViewerVisible = false;
    let currentImage = -1;
    let links = [];
    let currentImageLoadHandler = null;

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
        if (e.addedNodes.length > 0 && e.addedNodes[0].className=='callout-backdrop') {
            let elements = document.getElementsByClassName('modal-image');
            if (elements.length === 0) return;
            log("enhance:", e);
            //debugger;
            imageViewerVisible = true;
            enhance();
        } else if (e.removedNodes.length > 0 && e.removedNodes[0].className == 'callout-backdrop') {
            log("dehance:", e);
            imageViewerVisible = false;
            dehance();
        }
    };

    let log = function () {
        if (DEBUG) {
            let args = Array.prototype.slice.call(arguments);
            args.unshift("%c[" + that.getName() + "]", 'font-weight: bold;color: green;');
            console.log.apply(console, args);
        }
    };

    HTMLElement.prototype.prependChild = function (element) {
        this.insertBefore(element, this.firstChild);
    };

    let loadingIndicator = function() {
        let spinner = document.createElement("span");
        spinner.className = "spinner";
        let spinnerInner = document.createElement("span");
        spinnerInner.className = "spinner-inner spinner-wandering-cubes";
        spinner.appendChild(spinnerInner);
        let spanCube1 = document.createElement("span");
        spanCube1.className = "spinner-item";
        let spanCube2 = document.createElement("span");
        spanCube2.className = "spinner-item";
        spinnerInner.appendChild(spanCube1);
        spinnerInner.appendChild(spanCube2);
        return spinner;
    }();

    let statusLine = function() {
        let statusLine = document.createElement("a");
        statusLine.className = "download-button";
        statusLine.href = "#";
        statusLine.style.textAlign = "center";
        statusLine.addEventListener("click", function (e) {
            e.preventDefault();
            scrollRight();
        });
        statusLine.setText = function (curr, max) {
            statusLine.innerHTML = curr + "/" + max;
        };
        return statusLine;
    }();

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

    let leftAndRightButtons = new function() {
        let that = this;
        let createButton = function(character, clickListener) {
            let b = document.createElement("a");
            b.className = "download-button";
            b.href = "#";
            b.innerHTML = character;
            b.addEventListener("click", function(e) {
                e.preventDefault();
                clickListener(e);
            });
            b.style.position = "fixed";
            b.style.top = "50%";
            b.style.transform = "translateY(-50%)";
            b.style.fontSize = "300%";
            return b;
        };
        let leftArrow = createButton("◀", scrollLeft);
        leftArrow.style.left = "1%";
        let rightArrow = createButton("▶", scrollRight);
        rightArrow.style.right = "1%";
        that.addTo = function(modal) {
            modal.appendChild(leftArrow);
            modal.appendChild(rightArrow);
        };
    }();

    let keyListener = function (e) {
        if (e.keyCode === 65 || e.keyCode === 37) {	//left (a/left arrow)
            scrollLeft();
        } else if (e.keyCode === 68 || e.keyCode === 39) {	//right (d/right arrow)
            scrollRight();
        }
    };

	let scrollToMessage = function(msg) {
		//$(".messages")[0].scrollTop= $($(".message-group")[10]).offset().top;
		log("Offset: " + $(msg).offset().top, msg, "ScrollTop: " + $(".messages")[0].scrollTop);
		$(".messages")[0].scrollTop += $(msg).offset().top - 50;
	};

    let updateCurrentImage = function () {
        if (imageViewerVisible) {
            if (currentImageLoadHandler != null) {
                currentImageLoadHandler.remove();
            }
            let url = links[currentImage].discordUrl;
            if (url.indexOf("?width") != -1) {
                url = url.substr(0, url.indexOf("?width"));
            }
            let windowRatio = window.innerWidth / window.innerHeight;
            let imageRatio = links[currentImage].imageTag.getAttribute("width") / links[currentImage].imageTag.getAttribute("height");
            let imageSize = {};
            if (imageRatio < windowRatio) {    //calc for height
                let height = window.innerHeight * 0.65;
                let width = height * imageRatio;
                imageSize = {"h": height, "w": width};
            } else {    //calc with width
                let width = window.innerWidth * 0.75;
                let height = width / imageRatio;
                imageSize = {"h": height, "w": width};
            }
            //if it's no gif add width and height
            if (links[currentImage].imageTag.tagName.toLowerCase() !== "canvas") {
                url += "?width=" + Math.floor(imageSize.w);
                url += "&height=" + Math.floor(imageSize.h);
            }
            let newImg = new Image(imageSize.w, imageSize.h);
            newImg.className = "image";
            newImg.src = url;
            currentImageLoadHandler = function (img) {
                let disabled = false;
                let handler = function (e) {
                    if (!disabled) {
                        let frag = document.createDocumentFragment();
                        frag.appendChild(statusLine);
                        frag.appendChild(newImg);
                        $("span.image.image-loading").remove();
                        $(".modal-image").prepend(frag);
                    }
                };
                handler.remove = function() {
                    disabled = true;
                    img.removeEventListener("load", handler);
                };
                return handler;
            }(newImg);
            newImg.addEventListener("load", currentImageLoadHandler);
            $(".modal-image img, span.image.image-loading").remove();
            let imgLoading = document.createElement("span");
            imgLoading.className = "image image-loading";
            imgLoading.style.width = imageSize.w + "px";
            imgLoading.style.height = imageSize.h + "px";
            imgLoading.style.backgroundImage = "url(\"" + links[currentImage].discordUrl + "\")";
            imgLoading.appendChild(loadingIndicator);
            let frag = document.createDocumentFragment();
            frag.appendChild(statusLine);
            frag.appendChild(imgLoading);
            document.getElementsByClassName('modal-image')[0].prependChild(frag);
            $(".download-button").attr("href", links[currentImage].sourceUrl);
            statusLine.setText(currentImage + 1, links.length);
			scrollToMessage(links[currentImage].message);
        }
    };

    let enhance = function () {
        let images = $("img.image, span.image canvas").not($(".modal-image img"));
        for (let i = 0; i < images.length; i++) {
            switch (images[i].tagName.toLowerCase()) {
                case "img":
                    links[i] = {"discordUrl": images[i].src, "sourceUrl": images[i].getAttribute("href")};
                    break;
                case "canvas":
                    let link = images[i].getAttribute("src");
                    links[i] = {"discordUrl": link, "sourceUrl": link};
                    break;
                default:
                    log("unknown element found: ", images[i]);
                    break;
            }
            links[i].imageTag = images[i];
			links[i].message = $(images[i]).closest(".message-group");
        }
        let modalDialog = document.getElementsByClassName('modal-image')[0];
        let currentSourceLink = modalDialog.childNodes[1].getAttribute("href");
        for (let i = 0; i < links.length; i++) {
            if (links[i].sourceUrl === currentSourceLink) {
                currentImage = i;
                break;
            }
        }
        statusLine.setText(currentImage + 1, links.length);
        modalDialog.prependChild(statusLine);
        leftAndRightButtons.addTo(modalDialog);
        $(".download-button").attr("href", links[currentImage].sourceUrl);
        window.addEventListener("keydown", keyListener);
    };

    let dehance = function () {
        window.removeEventListener("keydown", keyListener);
        if (currentImageLoadHandler != null) currentImageLoadHandler.remove();
        links = [];
        currentImage = -1;
    };

};
