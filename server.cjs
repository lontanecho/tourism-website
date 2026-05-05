const jsonServer = require('json-server')
const multer = require('multer')
const cors = require('cors')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'uploads')
})

// 允许跨域 + 上传
server.use(cors())
server.use(middlewares)
server.use(jsonServer.bodyParser)

// 配置图床上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = file.originalname.split('.').pop()
    cb(null, `${unique}.${ext}`)
  }
})

const upload = multer({ storage })
server.post('/upload', upload.single('file'), (req, res) => {
  res.json({ url: '/' + req.file.filename })
})

server.use(router)

server.listen(3000, () => {
  console.log('✅ 本地服务器 + 图床已启动：http://localhost:3000')
})