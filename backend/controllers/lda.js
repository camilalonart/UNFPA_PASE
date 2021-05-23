const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const model = "../../ml_models/Model.py";

router.get('/', function(req, res, next) {
  let numberOfTopics = req.query.numberOfTopics;
  let args = [model, '--numberOfTopics', numberOfTopics];
  let child = spawn('python3', args);
  let success;
  let message;

  child.stdout.on('data', function (data) {
    const scriptResult = JSON.parse(data);
    console.log(scriptResult);
    success = scriptResult.success;
    message = scriptResult.message;
  });
  
  child.stderr.on('data', (data) => {
    console.log(`error:${data}`);
  });

  child.on('close', function (code) {
    if (code !== 0) {
        return res.json({ success: false, message: "ERROR 500" }).status(500);
    } else {
      try {
        if(success) return res.json({success: success, data:'Modelo cargado', message: message}).status(200);
      } catch(err) {
        console.log(err);
      }
    }
  });
});

module.exports = router;
