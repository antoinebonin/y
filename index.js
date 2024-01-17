import { getAuthorsByIds } from "./auteurs.js";
import { getCommentsFromPostId } from "./commentaires.js";
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

    // J'ajoute l'auteur à son post
    posts = posts.map(function (post) {
        const author = authors.find(function (auteur) {
            return auteur.id === post.userId
        })
        post.author = author
        return post
    })

    // J'ajoute les commentaires a chaque post
    for (let index = 0; index < posts.length; index++) {
        let post = posts[index];
        posts[index].comments = await getCommentsFromPostId(post.id)
    }
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
        const paragraphe = document.createElement('p')
        paragraphe.innerText = `${comment.email} : ${comment.body}`
        commentsElement.appendChild(paragraphe)
    })
    return element
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