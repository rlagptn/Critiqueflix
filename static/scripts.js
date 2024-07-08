$(document).ready(function() {
    listing();
});

function listing() {
    fetch('/content').then((res) => res.json()).then((data) => {
        let rows = data['result']
        $('#cards-box').empty()
        rows.forEach((a) => {
            let comment = a['comment']
            let title = a['title']
            let desc = a['desc']
            let image = a['image']
            let star = a['star']

            let star_repeat = '⭐'.repeat(star)

            let temp_html = `<div class="col">
                                <div class="card h-100">
                                    <img src="${image}" class="card-img-top">
                                    <div class="card-body">
                                        <h5 class="card-title">${title}</h5>
                                        <p class="card-text">${desc}</p>
                                        <p>${star_repeat}</p>
                                        <p class="mycomment">${comment}</p>
                                        <button onclick="editContent('${title}')" class="btn btn-primary">Edit</button>
                                        <button onclick="deleteContent('${title}')" class="btn btn-danger">Delete</button>
                                    </div>
                                </div>
                            </div>`
            $('#cards-box').append(temp_html)
        })
    })
}

function posting() {
    let url = $('#url').val()
    let comment = $('#comment').val()
    let star = $('#star').val()

    let formData = new FormData();
    formData.append("url_give", url);
    formData.append("comment_give", comment);
    formData.append("star_give", star);

    fetch('/content', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        window.location.reload()
    })
}

function editContent(title) {
    let new_star = prompt("Enter your new rating (1-5):");
    let new_comment = prompt("Enter your new comment:");

    if (new_comment && new_star) {
        let formData = new FormData();
        formData.append("star_give", new_star);
        formData.append("comment_give", new_comment);

        fetch(`/content/${title}`, { method: "PUT", body: formData }).then((res) => res.json()).then((data) => {
            alert(data['msg'])
            window.location.reload()
        })
    }
}

function deleteContent(title) {
    fetch(`/content/${title}`, { method: "DELETE" }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        window.location.reload()
    })
}


function open_box() {
    $('#post-box').show()
}

function close_box() {
    $('#post-box').hide()
}
