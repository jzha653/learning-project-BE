"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@google-cloud/firestore");
const DB = new firestore_1.Firestore();
if (process.env.LOCAL === '1') {
    DB.settings({
        projectId: 'civic-matrix-327921',
        keyFilename: '/Users/jiaqiuzhao/Keys/learning-project-local-sa.json',
    });
}
else {
    DB.settings({
        projectId: 'civic-matrix-327921',
    });
}
exports.default = DB;
//# sourceMappingURL=database.js.map