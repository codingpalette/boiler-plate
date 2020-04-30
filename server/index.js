const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('몽고디비 연결 성공');
  })
  .catch(() => {
    console.log('몽고디비 연결 실패');
  });

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터 베이스에서 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginsuccess: false,
        message: '입력한 이메일에 해당되는 유저가 없습니다.',
      });
    }

    // 요청된 이메일이 데에터 베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginsuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });
      }
      // 비밀번호가 맞으면 토큰을 생성한다
      user.createToken((err, user) => {
        if (err) res.status(400).send(err);
        // 토큰을 저장한다 쿠키에다
        res
          .cookie('auth_cookie', user.token)
          .status(200)
          .json({ loginsuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 왔다는것은 auth 미들웨어를 통과했다는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user._role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
