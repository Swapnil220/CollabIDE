import { httpServer } from './app.js';
import './models/User.js';
import './models/Project.js';

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});