import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PathQuiz } from '../src/components/coffee/PathQuiz.tsx';
import { pathQuizzes } from '../src/data/pathQuizzes.ts';

// Radix portals mount in the browser. Server rendering verifies the client
// boundary; interactive question/keyboard behavior needs a browser check.
let questionCount = 0;
for (const [pathId, quiz] of Object.entries(pathQuizzes)) {
  assert(quiz.pathTitle.trim(), `${pathId} has a title`);
  assert(quiz.questions.length > 0, `${pathId} is not empty`);
  const seen = new Set();
  for (const question of quiz.questions) {
    assert(question.question.trim(), `${pathId} has no blank question`);
    assert(!seen.has(question.question), `${pathId} has no duplicate question`);
    seen.add(question.question);
    assert(question.options.length >= 2, `${pathId} offers multiple answers`);
    assert(question.options.every((option) => option.trim()), `${pathId} has no blank answer`);
    assert.equal(new Set(question.options).size, question.options.length, `${pathId} has distinct options`);
    assert(Number.isInteger(question.correctAnswer) && question.correctAnswer >= 0 && question.correctAnswer < question.options.length, `${pathId} has an answer in range`);
    assert(question.explanation.trim().length > 20, `${pathId} explains its answer`);
    questionCount += 1;
  }
  assert.doesNotThrow(() => renderToStaticMarkup(React.createElement(PathQuiz, { pathId, onClose: () => {} })), `${pathId} can cross the server/client boundary`);
}
assert.equal(Object.keys(pathQuizzes).length, 5);
assert.equal(questionCount, 25);
assert.equal(renderToStaticMarkup(React.createElement(PathQuiz, { pathId: 'missing-path', onClose: () => {} })), '', 'unknown quizzes do not render a broken dialog');
console.log('PASS: 5 quiz data sets, 25 valid/explained questions, and portal SSR boundary. Dialog interaction requires browser verification.');
