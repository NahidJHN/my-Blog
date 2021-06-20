window.onload = () => {
    let likeBtn = document.getElementsByClassName("likePost");
    let disLikeBtn = document.getElementsByClassName("dislikePost");

    for (let i = 0; i < likeBtn.length; i++) {
        let postId = likeBtn[i].dataset.postid;

        likeBtn[i].addEventListener("click", (e) => {
            let req = generateReq("likes", postId);
            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    if (data.liked) {
                        likeBtn[
                            i
                        ].innerHTML = `<i class="far fa-thumbs-up"> Liked (${data.totalLiked})`;
                        likeBtn[i].classList.add("text-primary");
                        disLikeBtn[i].classList.remove("text-warning");

                        disLikeBtn[
                            i
                        ].innerHTML = `<i class="far fa-thumbs-down"> Dislike (${data.totalDisLiked})`;
                    } else {
                        likeBtn[
                            i
                        ].innerHTML = `<i class="far fa-thumbs-up"> Like (${data.totalLiked})`;
                        likeBtn[i].classList.remove("text-primary");
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    }
    for (let i = 0; i < likeBtn.length; i++) {
        let postId = likeBtn[i].dataset.postid;

        disLikeBtn[i].addEventListener("click", (e) => {
            let req = generateReq("dislikes", postId);
            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    if (data.disLiked) {
                        likeBtn[
                            i
                        ].innerHTML = `<i class="far fa-thumbs-up"> Like (${data.totalLiked})`;
                        disLikeBtn[
                            i
                        ].innerHTML = `<i class="far fa-thumbs-down"> Disliked (${data.totalDisLiked})`;
                        disLikeBtn[i].classList.add("text-warning");
                        likeBtn[i].classList.remove("text-primary");
                    } else {
                        disLikeBtn[
                            i
                        ].innerHTML = `<i class="far fa-thumbs-down"> Dislike (${data.totalDisLiked})`;
                        disLikeBtn[i].classList.remove("text-warning");
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    }

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