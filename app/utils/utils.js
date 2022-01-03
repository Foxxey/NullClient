'use strict';

module.exports = {
    locationTest: (url) => {
        try {
            const target = new URL(url);
            if(/krunker.io/.test(target.hostname)) {
                if (/docs/.test(target.pathname)) {
                    return 'docs'
                }
                if(/comp./.test(target.hostname)) {
                    return 'comp'
                }
                switch (target.pathname) {
                    case '/':
                        return 'game';
                    case '/social.html':
                        return 'social'
                    case '/viewer.html':
                        return 'viewer'
                    case '/editor.html':
                        return 'editor'
                    default:
                        return 'unknown'
                }
            } else {
                return 'external'
            }
        } catch (err) {
            return 'invalid'
        }
    }
}