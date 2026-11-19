const express = require('express');
const notesRouter = require('./routes/notes');

const app = express();

// Cho phép API nhận dữ liệu JSON
app.use(express.json());

// API trang chủ
app.get('/', (req, res) => {
  res.json({
    message: 'API ghi chú - Bài 3',
    course: 'Điện toán đám mây',
    status: 'success'
  });
});

// API quản lý ghi chú MongoDB
app.use('/notes', notesRouter);

// Xử lý lỗi API
app.use((err, req, res, next) => {
  console.error(err);

  const clientError =
    ['ValidationError', 'CastError'].includes(err.name) ||
    err.code === 'LIMIT_FILE_SIZE';

  res.status(clientError ? 400 : 500).json({
    error: clientError
      ? err.message
      : 'Lỗi máy chủ nội bộ'
  });
});

module.exports = app;
