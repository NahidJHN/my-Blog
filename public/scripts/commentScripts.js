let comment = document.getElementById("comment");
let commentBtn = document.getElementById("commentBtn");
let replyBtn = document.getElementById("replyBtn");
let replies = document.getElementsByName("replies");
let repliesInput = document.getElementsByClassName("repliesInput");
let postId = comment.dataset.post;

commentBtn.addEventListener("click", function (e) {
    if (comment.value) {
        const data = {
            body: comment.value,
        };
        let req = generateReq(`/api/comments/${postId}`, data);
        fetch(req)
            .then((res) => res.json())
            .then((data) => {
                createCommentSection(data, document.getElementsByClassName("commentWraper")[0]);
                comment.value = "";
                document.getElementById("noComment").remove();
            });
    } else {
        alert("Comment can't be empty");
    }
});

comment.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        if (e.target.value) {
            const data = {
                body: e.target.value,
            };
            let req = generateReq(`/api/comments/${postId}`, data);
            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    createCommentSection(data, document.getElementsByClassName("commentWraper")[0]);
                    comment.value = "";
                    document.getElementById("noComment").innerHTML = "";
                });
        } else {
            alert("Comment can't be empty");
        }
    }
});

let commentHolder = document.getElementById("commentHolder");

for (let i = 0; i < repliesInput.length; i++) {
    let input = repliesInput[i].children[0];
    repliesInput[i].children[1].addEventListener("click", function (e) {
        let commentId = input.dataset.comment;
        let value = input.value;

        if (value) {
            let data = {
                body: value,
            };

            let req = generateReq(`/api/replies/${commentId}`, data);
            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    createRepliesSection(data, input.parentElement);
                    input.value = "";
                });
        } else {
            alert("Reply can't be empty");
        }
    });
}

commentHolder.addEventListener("keypress", function (e) {
    if (this.hasChildNodes(e.target)) {
        if (e.key === "Enter") {
            let commentId = e.target.dataset.comment;
            let value = e.target.value;

            if (value) {
                let data = {
                    body: value,
                };

                let req = generateReq(`/api/replies/${commentId}`, data);
                fetch(req)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(e.target.parentNode);

                        createRepliesSection(data, e.target.parentElement);
                        e.target.value = "";
                    });
            } else {
                alert("Reply can't be empty");
            }
        }
    }
});

function createCommentSection(data, parent) {
    const commentrepliesBody = `
                                    <div class="commentSection">
                                    <div class=" d-flex">
                                        <div class="userThumbnail mr-3">
                                            <img src="${data.user.profilePics}"
                                                class="commentUserThumbnail thumbnail rounded-circle" alt="thumbnail">
                                        </div>
                                        <div style="width: 100%;">
                                            <p style="margin-bottom:0px"><a style="text-align: end;text-decoration: none;" href="">${data.user.name}</a> <span style="margin-left: 10px;">${data.body}</span></p>  </div>
                                    </div>
                                     <div class="repliesInput">
                                        <input class="form-control mt-2" type="text" name="replies" placeholder="Reply"
                                            data-comment="${data._id}" id="replies" />

                                             <button class="btn btn-sm btn-danger" id="replyBtn">send</button>
                            
                                    </div>
                                    </div>`;

    let ul = document.createElement("ul");
    ul.className = "list-group";
    ul.setAttribute("id", "commentReplies");

    ul.innerHTML = commentrepliesBody;
    parent.insertAdjacentElement("afterBegin", ul);
}

function createRepliesSection(data, parent) {
    let replies = `<div class="commentSection d-flex ">
                                        <div style="width:40px" class="userThumbnail mr-3">
                                            <img src="${data.profilePics}"
                                                class="commentUserThumbnail thumbnail rounded-circle" alt="">
                                        </div>
                                        <div style="width: 100%;">
                                            <p style="margin-bottom:0px"><a style="text-align: end;text-decoration: none;" href="">${data.username}</a> <span style="margin-left: 10px;">${data.body}</span></p>
                                        </div>
                                        </div>`;

    let div = document.createElement("div");
    div.setAttribute("class", "repliesDiv");
    div.innerHTML = replies;
    parent.insertAdjacentElement("beforeBegin", div);
}

function generateReq(url, body) {
    let headers = new Headers();
    headers.append("Accept", "Application/JSON");
    headers.append("Content-Type", "Application/JSON");

    let req = new Request(url, {
        method: "POST",
        headers,
        mode: "cors",
        body: JSON.stringify(body),
    });
    return req;
}
