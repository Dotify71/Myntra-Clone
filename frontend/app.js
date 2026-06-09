import { initRouter } from './router.js';
import './auth.js';
import './ui.js';

import { initSearch } from './views/searchInit.js';
import './views/routeEffects.js';
import './views/scrollTopButton.js';
import './views/darkMode.js';

initRouter();
initSearch();
