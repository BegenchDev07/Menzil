const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const UserModel = require('./model/admin')
const multer = require('multer');
const fs = require('fs');
const NewsContent = require('./model/NewsModel');
const ProductsModel = require('./model/ProductsModel');
require('./config/config')(passport)
//manager requests handling middleware
//ejs middleware
app.set('views',path.join(__dirname,'views/html'));
app.set('view engine','ejs');
app.use('/news', express.static('news'));
app.use('/products', express.static('products'));
app.use(express.static('views'))
app.use('/products', express.static('products'));
//middleware for mongoose
mongoose.connect('mongodb://localhost:27017/NewProject',{useNewUrlParser: true, useUnifiedTopology:true},console.log('main_connected'));
//body-parser middleware
const urlencodedparser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
//mongodb session
//express-session
app.use(
    session({
		secret: 'procorial',
		resave: false,
		saveUninitialized: true
	})
)
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//storage engine for multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './news')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
//storage for products
var storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './products')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadProducts = multer({ storage: storageProducts })
//finish
//requests
app.get('/',function(req,res){
    res.render('index');
});
app.get('/ru',function(req,res){
  res.render('index_ru')
})
app.get('/tkm',function(req,res){
  res.render('index_tkm')
})
app.get('/About',function(req,res){
    res.render('about')
});
app.get('/ru/About',function(req,res){
  res.render('about_ru')
});
app.get('/tkm/About',function(req,res){
  res.render('about_tkm')
});
app.get('/Services',function(req,res){
    res.render('Services')
});
app.get('/ru/Services',function(req,res){
  res.render('services_ru');
})
app.get('/tkm/Services',function(req,res){
  res.render('services_tkm');
})
app.get('/ComingSoon',function(req,res){
    res.render('cmn_soon')
});
app.get('/ru/ComingSoon',function(req,res){
  res.render('cmn_soon_ru')
});
app.get('/tkm/ComingSoon',function(req,res){
  res.render('cmn_soon_tkm')
});
app.get('/Contacts',function(req,res){
    res.render('contacts')
});
app.get('/ru/Contacts',function(req,res){
  res.render('contacts_ru')
});
app.get('/tkm/Contacts',function(req,res){
  res.render('contacts_tkm')
});
app.get('/News',function(req,res){
  NewsContent.findOne({'lang':'en'}).sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('news',{data: data})
    }
  })
})
app.get('/ru/News',function(req,res){
  NewsContent.findOne({'lang':'ru'}).sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('news_ru',{data: data})
    }
  })
})
app.get('/tkm/News',function(req,res){
  NewsContent.findOne({'lang':'tkm'}).sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('news_tkm',{data: data})
    }
  })
})
app.get('/Products',function(req,res){
  ProductsModel.find({'lang':'en'}).sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('product',{data: data})
    }
  })
})
app.get('/ru/Products',function(req,res){
  ProductsModel.find({'lang':'ru'}).sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('product_ru',{data: data})
    }
  })
})
app.get('/tkm/Products',function(req,res){
  ProductsModel.find({'lang':'tkm'}).sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('product_tkm',{data: data})
    }
  })
})
app.get('/product/:id',function(req,res){
  ProductsModel.findOne({'name':req.params.id,'lang':'en'},function(err,data){
    if(err) throw err
    else{
      res.render('product_more',{data:data})
    }
  })
})
app.get('/ru/product/:id',function(req,res){
  ProductsModel.findOne({'name':req.params.id,'lang':'ru'},function(err,data){
    if(err) throw err
    else{
      res.render('product_more_ru',{data:data})
    }
  })
})
app.get('/tkm/product/:id',function(req,res){
  ProductsModel.findOne({'name':req.params.id,'lang':'tkm'},function(err,data){
    if(err) throw err
    else{
      res.render('product_more_tkm',{data:data})
    }
  })
})
app.get('/admin',function(req,res){
  res.render('admin')
})
app.post('/admin',urlencodedparser,passport.authenticate('local',{successRedirect:'/BitaBi', failureRedirect: '/admin' }),function(req,res){
  
  
});
// app.post('/admin',urlencodedparser,function(req,res){
//     user = UserModel();
//     user.username = req.body.username;
//     user.password = req.body.password;
//     user.save(function(err,user){
//         if(err) throw err;
//         else{
//             console.log(user);
//         }
//     })
// })

//logout handler
app.get('/logout',function(req,res){
    req.logOut();
    res.redirect('/');
})
app.get('/BitaBi',checker,function(req,res){
  res.render('creator');
})
app.post('/BitaBi',urlencodedparser,checker,upload.single('profile-file'), function (req, res, next) {
  let news = NewsContent();
  news.title = req.body.data;
  news.desc = req.body.desc;
  news.filename = req.file.path;
  news.lang = req.body.lang;
  news.save(function(err,news){
    if(err) throw err;
    else{
      console.log(news);
    }
  })
})
app.get('/BitaBi_products',checker,function(req,res){
  res.render('producer');
})
app.post('/BitaBi_products',urlencodedparser,checker,uploadProducts.array('profile-files',6), function (req, res, next) {
  let product = ProductsModel();
  product.name = req.body.name;
  product.description = req.body.description;
  for(var i = 0; i < req.files.length; i++){
    product.filename[i] = req.files[i].filename;
  }
  product.price = req.body.price;
  product.pieces = req.body.pieces;
  product.lang = req.body.lang;
  product.save(function(err){
    if(err) throw err;
    res.redirect('/Products');
  })
})
app.get('/BitaBi_delete',checker,function(req,res){
  NewsContent.find().sort({'_id':-1}).exec(function(err,data){
    if(err) throw err;
    else{
      res.render('BitaBi_delete',{data:data})
    }
  })
})
// app.delete('/delete/:id',urlencodedparser,checker,function(req,res){
//   NewsContent.findOneAndRemove({'_id':req.params.id},function(err){
//     if(err){
//       throw err
//     }
//     else{
//       res.redirect('/BitaBi_delete');
//     }
//   })
// })
//404-situation handling
app.use(function(req,res){
    res.status(404).render('not_found')
})

app.listen(3000,function(){
    console.log('server is on port 3000')
})

function checker(req,res,next){
  if(req.isAuthenticated()){
    next();
    console.log(req.isAuthenticated())
  }
  else{
    res.redirect('/')
  }
}
