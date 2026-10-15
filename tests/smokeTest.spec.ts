import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger';
import { createToken } from '../helpers/createToken';


let authToken: string


test.beforeAll('Run before all', async ({ api, config }) => {
    // const tokenResponse = await api
    //     .path('/users/login')
    //     .body({ "user": { "email": config.userEmail, "password": config.userPassword}})
    //     .postRequest(200)

    authToken = await createToken(api, config.userEmail, config.userPassword)
})


test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)
    // console.log(response)
})


test('Get Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags[0]).toEqual('Test')
    expect(response.tags.length).toBeLessThanOrEqual(10)
})


test('Create and Delete Article', async ({ api }) => {
    const response = await api
        .path('/articles')
        .headers({"Authorization": authToken})
        .body({"article": {"title": "Test", "description": "Test Description", "body": "Test Body", "tagList": []}})
        .postRequest(201)
    expect (response.article.title).toEqual('Test')


    const slugId = response.article.slug


    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect (articlesResponse.articles[0].title).toEqual('Test')


    const deleteArticleResponse = await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)
})


test('Create, Update and Delete Article', async ({ api }) => {
    const response = await api
        .path('/articles')
        .headers({"Authorization": authToken})
        .body({"article": {"title": "TestTWO", "description": "Test Description", "body": "Test Body", "tagList": []}})
        .postRequest(201)
    expect (response.article.title).toEqual('TestTWO')


    const slugId = response.article.slug


    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    expect (articlesResponse.articles[0].title).toEqual('TestTWO')


    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body({"article": {"title": "TestTWO Modified", "description": "Test Description", "body": "Test Body", "tagList": []}})
        .putRequest(200)
    expect (updateArticleResponse.article.title).toEqual('TestTWO Modified')


    const newSlugId = updateArticleResponse.article.slug


    const deleteArticleResponse = await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)
})