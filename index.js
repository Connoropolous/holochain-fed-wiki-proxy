const axios = require('axios')
const express = require('express')
const app = express()

const domain = 'http://localhost:4141'

app.get('/sitemap.json', (req, res) => {
  res.send('sitemap')
})

app.get('/favicon.png', (req, res) => {
  axios.get(domain + '/favicon.png', { responseType: 'arraybuffer' }).then(response => {
    res.contentType('image/png');
    res.send(new Buffer(response.data));
  })
  .catch(err => {
    res.status(404).send()
  })
})

app.get('/:slug', (req, res) => {
  // welcome.json becomes welcome
  var slug = req.params.slug.split('.')[0]
  holochain('pages', 'getPageBySlug', {
    slug: slug
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
