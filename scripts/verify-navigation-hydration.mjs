import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime.js';
import { BreadcrumbNav } from '../src/components/BreadcrumbNav.tsx';

const render = (path) => renderToString(React.createElement(PathnameContext.Provider, { value: path }, React.createElement(BreadcrumbNav)));
const home = render('/');
assert.equal(render('/index'), home, 'an internal home path must not create a phantom breadcrumb before hydration');
assert.equal(home, '', 'the homepage fallback has no breadcrumb');
assert.equal(render('/courses'), render('/internal-course-route'), 'public breadcrumbs have the same initial fallback under rewrites');
assert.equal(render(null), home, 'an unresolved pathname has a stable fallback');
console.log('PASS: breadcrumb SSR is stable for home, rewritten paths and unresolved paths. Active navigation and hydration require browser verification.');
