import { getAuthorsByIds } from "./auteurs.js";
import { getAllComments, getCommentsFromPostId } from "./commentaires.js";
import { getAllPosts } from "./posts.js";
import { shuffle } from "./utils.js";

async function recupererTweets() {
    // Je récupère tous les posts
    let posts = await getAllPosts()

    // Je récupère tous les id des auteurs des posts
    let authorsIds = []
    posts.forEach(function(post) {
        if (!authorsIds.includes(post.userId)) {
            authorsIds.push(post.userId)
        }
    });

    // Je récupère tous les auteurs de mes posts
    const authors = await getAuthorsByIds(authorsIds)
    const comments = await getAllComments()

    // J'ajoute l'auteur et les commentaires à son post
    posts = posts.map(function (post) {
        const author = authors.find(function (auteur) {
            return auteur.id === post.userId
        })
        post.author = author
        const comment = comments.filter(function (comment) {
            return comment.postId === post.id
        })
        post.comments = comment
        return post
    })
    console.log(posts);
    return posts
}

function remplirTemplate(element, post) {
    element.querySelector('.post').id = `post-${post.id}`
    element.querySelector('.post-title').textContent = post.title
    element.querySelector('.post-username').textContent = `@${post.author.username}`
    element.querySelector('.post-content p').textContent = post.body
    element.querySelector('.avatar').src = `https://ui-avatars.com/api/?name=${post.author.name}&background=random`
    element.querySelector('.post-comment-nb').textContent = `${post.comments.length} commentaire(s)`

    element.querySelector('.post-comment-nb').addEventListener('click', function() {
        toogleComments(`post-${post.id}`)
    })

    const commentsElement = element.querySelector('.comments')
    post.comments.forEach(function (comment) {
        const commentElement = remplirCommentaire(comment)
        commentsElement.appendChild(commentElement)
    })
    return element
}

function remplirCommentaire(comment) {
    const template = document.getElementById('comment-tpl')
    const commentElement = template.content.cloneNode(true)
    const pseudo = comment.email.split('@')[0]
    commentElement.querySelector('.comment-avatar').src = `https://ui-avatars.com/api/?name=${pseudo}&background=random`
    const usernameElement = commentElement.querySelector('.comment-username')
    usernameElement.href = `mailto:${comment.email}`
    usernameElement.innerText = `@${pseudo}`
    commentElement.querySelector('.comment-content').textContent = comment.body
    return commentElement
}

async function afficherTweets() {
    let tweets = await recupererTweets()
    tweets = shuffle(tweets)
    const template = document.getElementById('post-tpl')
    const container = document.getElementById('posts-container')

    tweets.forEach(function (tweet) {
        console.log(tweet);
        const element = template.content.cloneNode(true)
        const elementPlein = remplirTemplate(element, tweet)
        container.appendChild(elementPlein)
    })
}

afficherTweets()

function toogleComments(postId) {
    const commentsElement = document.querySelector(`#${postId} .comments`)
    commentsElement.classList.toggle('hide')
}