document.addEventListener("DOMContentLoaded", function () {
    ImgUpload();
});

function ImgUpload() {
    var imgWrap = "";
    var imgArray = [];

    var uploadInputs = document.querySelectorAll(".upload__inputfile");
    uploadInputs.forEach(function (input) {
        input.addEventListener("change", function (e) {
            imgWrap =
                this.closest(".upload__box").querySelector(".upload__img-wrap");
            var maxLength = this.getAttribute("data-max_length");

            var files = e.target.files;
            var filesArr = Array.prototype.slice.call(files);
            var iterator = 0;
            filesArr.forEach(function (f, index) {
                if (!f.type.match("image.*")) {
                    return;
                }

                if (imgArray.length > maxLength) {
                    return false;
                } else {
                    var len = imgArray.filter(function (item) {
                        return item !== undefined;
                    }).length;
                    if (len > maxLength) {
                        return false;
                    } else {
                        imgArray.push(f);

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var html =
                                "<div class='upload__img-box'><div style='background-image: url(" +
                                e.target.result +
                                ")' data-number='" +
                                document.querySelectorAll(".upload__img-close").length +
                                "' data-file='" +
                                f.name +
                                "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                            imgWrap.insertAdjacentHTML("beforeend", html);
                            iterator++;
                        };
                        reader.readAsDataURL(f);
                    }
                }
            });
        });
    });

    document.body.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("upload__img-close")) {
            var file = e.target.parentNode.dataset.file;
            for (var i = 0; i < imgArray.length; i++) {
                if (imgArray[i].name === file) {
                    imgArray.splice(i, 1);
                    break;
                }
            }
            e.target.parentNode.parentNode.remove();
        }
    });
}

CKEDITOR.replace("editor", {
    extraPlugins: "justify, colorbutton",
});