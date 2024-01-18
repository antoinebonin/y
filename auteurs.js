export async function getAuthor(id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    const data = await response.json()
    return data
}

export async function getAllAuthors() {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`)
    const data = await response.json()
    return data
}

export async function getAuthorsByIds(ids) {
    let authors = []
    for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        const author = await getAuthor(id)
        authors.push(author)
    }
    return authors
}