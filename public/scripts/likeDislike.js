window.onload = () => {
    let likeBtn = document.getElementById("likePost");
    let postId = likeBtn.dataset.postid;
    let disLikeBtn = document.getElementById("dislikePost");
    likeBtn.addEventListener("click", (e) => {
        let req = generateReq("likes", postId);
        fetch(req)
            .then((res) => res.json())
            .then((data) => {
                if (data.liked) {
                    likeBtn.innerHTML = `<i class="far fa-thumbs-up"> Liked (${data.totalLiked})`;
                    likeBtn.classList.add("text-primary");
                    disLikeBtn.classList.remove("text-warning");

                    disLikeBtn.innerHTML = `<i class="far fa-thumbs-down"> Dislike (${data.totalDisLiked})`;
                } else {
                    likeBtn.innerHTML = `<i class="far fa-thumbs-up"> Like (${data.totalLiked})`;
                    likeBtn.classList.remove("text-primary");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });

    disLikeBtn.addEventListener("click", (e) => {
        let req = generateReq("dislikes", postId);
        fetch(req)
            .then((res) => res.json())
            .then((data) => {
                if (data.disLiked) {
                    likeBtn.innerHTML = `<i class="far fa-thumbs-up"> Like (${data.totalLiked})`;
                    disLikeBtn.innerHTML = `<i class="far fa-thumbs-down"> Disliked (${data.totalDisLiked})`;
                    disLikeBtn.classList.add("text-warning");
                    likeBtn.classList.remove("text-primary");
                } else {
                    disLikeBtn.innerHTML = `<i class="far fa-thumbs-down"> Dislike (${data.totalDisLiked})`;
                    disLikeBtn.classList.remove("text-warning");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });

    function generateReq(url, postId) {
        let headers = new Headers();
        headers.append("Accept", "Application/JSON");
        headers.append("Content-Type", "Application/JSON");

        let req = new Request(`/api/${url}/${postId}`, {
            method: "GET",
            headers,
            mode: "cors",
        });
        return req;
    }
};
