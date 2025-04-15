const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 5002;

app.use(express.json());

app.post('/execute', (req, res) => {
  const code = req.body.code || '';
  
  const child = exec(`node -e "${code.replace(/"/g, '\\"')}"`, {
    timeout: 5000
  }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        output: error.message || stderr
      });
    }
    
    res.json({
      success: true,
      output: stdout || stderr
    });
  });
});

app.listen(port, () => {
  console.log(`Node.js execution server running on port ${port}`);
});