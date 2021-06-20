window.onload = function () {
    const croppedImage = document.getElementById("croppedImage");
    const cropModal = document.getElementById("crop-modal");
    const uploadImage = document.getElementById("uploadImage");
    const myModal = new bootstrap.Modal(cropModal);
    const uploadButton = document.getElementById("uploadButton");

    let baseCroppie = new Croppie(croppedImage, {
        viewport: {
            width: 200,
            height: 200,
            type: "circle",
        },
        boundary: {
            width: 300,
            height: 300,
        },
        showZommer: true,
    });

    function readbleFile(file) {
        let reader = new FileReader();
        reader.onload = (event) => {
            baseCroppie.bind({
                url: event.target.result,
            });
        };
        reader.readAsDataURL(file);
    }

    uploadImage.addEventListener("change", function (event) {
        if (this.files[0]) {
            readbleFile(this.files[0]);
            new bootstrap.Modal(cropModal, {
                backdrop: "static",
                keyboard: false,
            });
            myModal.show();
        }
    });

    uploadButton.addEventListener("click", function () {
        baseCroppie
            .result("blob")
            .then((blob) => {
                let formData = new FormData();
                const file = uploadImage.files[0];
                const fileName = generateFileName(file.name);
                formData.append("uploadImage", blob, fileName);
                const headers = new Headers();
                headers.append("Accept", "Application/JSON");

                const req = new Request("/upload/profile-pics", {
                    method: "POST",
                    mode: "cors",
                    headers,
                    body: formData,
                });
                return fetch(req);
            })
            .then((res) => res.json())
            .then((data) => {
                document.querySelector("#showImage").src = data.profilePics;
                document.getElementById("uploadPicsForm").reset();
                document.getElementById("uploadMessage").innerHTML =
                    "Profile photo upload Successfull";
                document.getElementById("uploadMessage").style.display = "block";
                
                setTimeout(() => {
                    myModal.hide();
                }, 500);
            })
            .catch((e) => {
                console.log(e);
            });
    });

    function generateFileName(name) {
        const types = /(.jpg|.jpeg|.gif|.png)/;
        return name.replace(types, ".png");
    }
};