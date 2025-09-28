const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/taskController');


router.post('/', auth, controller.createTask);
router.get('/', auth, controller.getTasks);
router.get('/:id', auth, controller.getTask);
router.put('/:id', auth, controller.updateTask);
router.patch('/:id', auth, controller.patchTask);
router.delete('/:id', auth, controller.deleteTask);


module.exports = router;