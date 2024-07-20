import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors package
// https://medium.com/@velja/token-refresh-with-axios-interceptors-for-a-seamless-authentication-experience-854b06064bde
const app = express();
const PORT = 8080;

// Use the cors middleware
app.use(cors());

app.use(bodyParser.json());

const products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  { id: 3, name: 'Product 3', price: 300 },
];

let cartItems = [ { id: 4, name: 'test cart product', price: 100 }];

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecret';
let refreshTokens = [];

app.get('/test', (req, res)=>{
  res.send('Hello World');
})

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, id: user.id },
      accessTokenSecret,
      { expiresIn: '20m' }
    );
    const refreshToken = jwt.sign(
      { username: user.username, id: user.id },
      refreshTokenSecret
    );

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.send('Username or password incorrect');
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: user.username, id: user.id },
      accessTokenSecret,
      { expiresIn: '20m' }
    );

    res.json({
      accessToken,
    });
  });
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/cart', authenticateJWT, (req, res) => {
  res.json(cartItems);
});
// req.body === {
// productId: id
// }

app.post('/cart', authenticateJWT, (req, res) => {
  const { productId } = req.body; 

  const product = products.find((p) => p.id === productId);

  if (product) {
    cartItems.push(product);
    res.json(cartItems);
  } else {
    res.send('Product not found');
  }
});

app.delete('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.send('Logout successful');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
