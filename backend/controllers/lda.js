const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const model = '/Users/camilalonart/Desktop/UNFPA_PASE/ml_models/Model.py';

router.get = async (req, res) => { 
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
        console.log('an error has occurred', code);
        return res.json({ success: false, message: "Ocurrió un error" }).status(500);
    } else {
      try {
        if(success) return res.json({success: success, message: message}).status(200);
        else return res.json({success: success, message: message}).status(400);
      } catch(err) {
        console.log(err);
        return res.json({ success: false, message: "Ocurrió un error" }).status(500);
      }
    }
  });
}

module.exports = router;