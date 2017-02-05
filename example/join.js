var join = require('../')
var hyperlog = require('hyperlog')
var memdb = require('memdb')

var log = hyperlog(memdb(), { valueEncoding: 'json' })
var j = join({
  log: log,
  db: memdb(),
  map: function (row, cb) {
    var v = row.value
    if (v.changeset) cb(null, { key: v.changeset, value: v.id })
    else cb()
  }
})

log.append({ id: 'A', type: 'changeset', tags: { comment: 'whatever' } })
log.append({ id: 'B', type: 'node', lat: 64.4, lon: -147.3, changeset: 'A' })
log.append({ id: 'C', type: 'node', lat: 63.9, lon: -147.6, changeset: 'A' })
log.append({ id: 'D', type: 'changeset', tags: { comment: 'hey' } })
log.append({ id: 'E', type: 'node', lat: 64.2, lon: -146.5, changeset: 'D' })

j.list('A', function (err, nodes) {
  console.log(nodes)
})
