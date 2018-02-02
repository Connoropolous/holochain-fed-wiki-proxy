const axios = require('axios')
const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())

const domain = 'http://localhost:4141'

app.get('/sitemap.json', (req, res) => {
  holochain('pages', 'getSitemap')
  .then(response => {
    res.send(response.data)
  })
  .catch(err => {
    res.sendStatus(404)
  })
})

app.get('/favicon.png', (req, res) => {
  axios.get(domain + '/favicon.png', { responseType: 'arraybuffer' }).then(response => {
    res.contentType('image/png');
    res.send(new Buffer(response.data));
  })
  .catch(err => {
    res.sendStatus(404)
  })
})

app.get('/:slug', (req, res) => {
  // welcome.json becomes welcome
  var slug = req.params.slug.split('.')[0]
  holochain('pages', 'getFedWikiJSON', {
    slug: slug
  })
  .then(response => {
    if (!response.data) {
      throw new Error("no page found")
    }
    res.send(response.data)
  })
  .catch(err => {
    res.sendStatus(404)
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
