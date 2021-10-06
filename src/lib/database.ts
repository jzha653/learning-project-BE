import {Firestore} from '@google-cloud/firestore';
const DB = new Firestore();
if (process.env.LOCAL === '1') {
  DB.settings({
    projectId: 'civic-matrix-327921',
    keyFilename: '/Users/jiaqiuzhao/Keys/learning-project-local-sa.json',
  });
} else {
  DB.settings({
    projectId: 'civic-matrix-327921',
  });
}
export default DB;
