import assert from 'node:assert/strict';
import { loadCertificateFonts } from '../src/lib/certificate-fonts.ts';

const arabic = '"GoatArabic", "GoatArabic Fallback"';
const latin = '"GoatLatin"';
const requests = [];
assert.deepEqual(await loadCertificateFonts({ load: async (font, sample) => {
  requests.push({font, sample});
  return [{}];
}}, arabic, latin), {arabic, latin}, 'available branded fonts are retained');
assert(requests.some((entry) => entry.sample.includes('شهادة')), 'Arabic glyphs are explicitly requested');
assert(requests.some((entry) => entry.sample.includes('Goat')), 'Latin glyphs are explicitly requested');

assert.deepEqual(await loadCertificateFonts({ load: async (font) => {
  if (font.includes('GoatArabic')) throw new Error('NetworkError');
  return [{}];
}}, arabic, latin), {arabic:'Arial', latin}, 'a missing font does not stop certificate creation or discard another working font');

assert.deepEqual(await loadCertificateFonts({ load: () => {throw new SyntaxError('Invalid font shorthand');} }, arabic, latin), {arabic:'Arial', latin:'Arial'}, 'synchronous font parser failures are handled');
assert.deepEqual(await loadCertificateFonts({ load: () => new Promise(() => {}) }, arabic, latin, 5), {arabic:'Arial', latin:'Arial'}, 'unresponsive font downloads cannot leave the certificate busy forever');
assert.deepEqual(await loadCertificateFonts({ load: async () => [] }, arabic, latin), {arabic:'Arial', latin:'Arial'}, 'an unavailable font face uses a real fallback');
assert.deepEqual(await loadCertificateFonts(undefined, '', ''), {arabic:'Arial', latin:'Arial'}, 'missing font API and variables are safe');
console.log('PASS: certificate font success, partial network failure, parser failure, timeout, absent faces and absent API. PNG download still requires browser verification.');
