import { test, expect} from '@playwright/test';

let authToken: string

test.beforeAll('Run before all', async ({request}) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user": {"email": "email", "password": "password"}}
  })
  const tokenResponseJson = await tokenResponse.json()
  authToken = 'Token ' + tokenResponseJson.user.token
})

test('Get tags', async ({ request }) => {
 const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
 const tagsResponseJson = await tagsResponse.json()

 expect (tagsResponse.status()).toEqual(200)
 expect (tagsResponseJson.tags[0]).toEqual('Test')
 expect (tagsResponseJson.tags.length).toBeLessThanOrEqual(10)
});

test('Get articles', async ({request}) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJson = await articlesResponse.json()

  expect (articlesResponse.status()).toEqual(200)
  expect (articlesResponseJson.articles.length).toBeLessThanOrEqual(10)
  expect (articlesResponseJson.articlesCount).toEqual(10)
});

test('Create and Delete article', async ({request}) => {

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers: {"Authorization": authToken}, 
    data:{"article": {"title": "Test", "description": "Test Description", "body": "Test Body", "tagList": []}}
  })
  const newArticleResponseJson = await newArticleResponse.json()

  expect (newArticleResponse.status()).toEqual(201)
  expect (newArticleResponseJson.article.title).toEqual('Test')
  const slugId = newArticleResponseJson.article.slug

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {"Authorization": authToken}
  })
  const articlesResponseJson = await articlesResponse.json()

  expect (articlesResponse.status()).toEqual(200)
  expect (articlesResponseJson.articles[0].title).toEqual('Test')

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {"Authorization": authToken}
  })

  expect (deleteArticleResponse.status()).toEqual(204)
});


test('Create, Update and Delete article', async ({request}) => {
  
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers: {"Authorization": authToken}, 
    data:{"article": {"title": "TestTWO", "description": "Test Description", "body": "Test Body", "tagList": []}}
  })
  const newArticleResponseJson = await newArticleResponse.json()
  
  expect (newArticleResponse.status()).toEqual(201)
  expect (newArticleResponseJson.article.title).toEqual('TestTWO')
  const slugId = newArticleResponseJson.article.slug

  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {"Authorization": authToken}, 
    data:{"article": {"title": "TestTWO Modified", "description": "Test Description", "body": "Test Body", "tagList": []}}
  })
  
  expect (updateArticleResponse.status()).toEqual(200)

  const updateArticleResponseJson = await updateArticleResponse.json()

  expect (updateArticleResponseJson.article.title).toEqual('TestTWO Modified')
  const newSlugId = updateArticleResponseJson.article.slug


  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {"Authorization": authToken}
  })
  expect (articlesResponse.status()).toEqual(200)
  

  const articlesResponseJson = await articlesResponse.json()
  
  expect (articlesResponseJson.articles[0].title).toEqual('TestTWO Modified')

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {
    headers: {"Authorization": authToken}
  })

  expect (deleteArticleResponse.status()).toEqual(204)
});
