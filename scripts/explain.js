require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('../src/models/note');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'notes'
  });

  try {
    // Đồng bộ chỉ mục tags
    await Note.syncIndexes();

    // Truy vấn quét toàn bộ collection
    const scan = await Note.find({ tags: 'docker' })
      .hint({ $natural: 1 })
      .explain('executionStats');

    // Truy vấn sử dụng chỉ mục tags
    const idx = await Note.find({ tags: 'docker' })
      .hint({ tags: 1 })
      .explain('executionStats');

    const a = scan.executionStats;
    const b = idx.executionStats;

    console.table({
      'Quet toan bo': {
        docsExamined: a.totalDocsExamined,
        returned: a.nReturned,
        ms: a.executionTimeMillis
      },
      'Dung chi muc': {
        docsExamined: b.totalDocsExamined,
        returned: b.nReturned,
        ms: b.executionTimeMillis
      }
    });

    const ratio = a.totalDocsExamined /
      b.totalDocsExamined;

    console.log(
      'Chi muc giam so tai lieu phai quet:',
      ratio.toFixed(2),
      'lan'
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(err => {
  console.error('Loi:', err.message);
  process.exitCode = 1;
});
