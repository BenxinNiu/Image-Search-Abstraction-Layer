const express=require('express');
const request=require('request');
const app=express();
const mongo=require('mongodb').MongoClient;
const mongoURL="mongodb://benxin:nbx00144@ds127101.mlab.com:27101/urls";

app.get('/search/:word',(req,res)=>{
  var keyword=req.params.word;
  var offset=req.query.offset;
  var count=req.query.count;
  mongo.connect(mongoURL,(err,db)=>{
  if(err){db.close(); res.sendStatus(500);}
  else{
    var searched=db.collection('image-abstraction');
    searched.find({keyword:keyword}).toArray(function(err,doc){
      console.log(doc.length);
      if(doc.length!=0)
      searched.update({keyword:keyword},{$inc:{num:1}});
      else
       searched.insert({keyword:keyword,num:0});
        db.close();
    });
  }
  });
  request({
    uri:'https://api.cognitive.microsoft.com/bing/v5.0/search?q=' +keyword+'&count='+ count +'&offset='+offset+'&mkt=en-us&safesearch=Moderate',
    method:'GET',
    headers:{
      "Ocp-Apim-Subscription-Key":"aeed841c3db74a888c178b4268dbfa4d"
    }
  },function(err,response,data){
    if(err) res.send(500);
    else
    res.send(data);
  });
});

app.get('/recent',(req,res)=>{
  mongo.connect(mongoURL,(err,db)=>{
  if(err){db.close();res.sendStatus(500);}
  else{
    var searched=db.collection('image-abstraction');
    searched.find().toArray(function(err,docs){
      res.send(docs.reverse());
    });
  }
  });
})

const server=app.listen(process.env.port||'8080',function(){
  console.log('image search abstraction layer is listening on port '+ server.address().port);
  console.log('CTRL + C to stop the server');
});
