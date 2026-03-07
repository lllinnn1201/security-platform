import http from 'k6/http';
import { check, sleep } from 'k6';

const zipFile = open('./sample.zip', 'b');

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.10'],
    http_req_duration: ['p(95)<15000'],
  },
};

export default function () {
  const url = 'http://127.0.0.1:8000/scan';

  const data = {
    file: http.file(zipFile, 'sample.zip', 'application/zip'),
    gen_lock: 'on',
  };

  const res = http.post(url, data);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains 掃描結果': (r) => r.body && r.body.includes('掃描結果'),
  });

  sleep(1);
}