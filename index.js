const axios = require('axios')
const express = require('express')
const app = express()

const domain = 'http://localhost:4141'

app.get('/sitemap.json', (req, res) => {
  res.send('sitemap')
})

app.get('/favicon.ico', (req, res) => {
  axios.get(domain + '/favicon.ico').then(favicon => {
    res.sendFile(favicon)
  })
  .catch(() => {
    res.status(404).send()
  })
})

app.get('/:pageTitle', (req, res) => {
  // welcome.json becomes welcome
  var pageTitle = req.params.pageTitle.split('.')[0]
  holochain('pages', 'getPageByTitle', {
    pageTitle: pageTitle
  })
  .then(response => {
    res.send(response.data)
  })
  .catch(err => {
    console.log(err)
    res.status(404).send(err)
  })
})

app.listen(3002, () => {
  console.log('Example app listening on port 3002')
})

function holochain(zome, fn, data) {
  data = JSON.stringify(data)
  const url = domain + '/fn/' + zome + '/' + fn
  return axios.post(url, data)
}