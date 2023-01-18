import alt from 'alt-client';
import native from 'natives';

// Must be a blank index page.
let _defaultURL = `http://assets/webviews/index.html`;
let _isReady: boolean = false;
let _webview: alt.WebView;
let _cursorCount: number = 0;

export const WebViewController = {
    /**
     * Sets the URL to use based on current deployment.
     */
    create(url?: string) {
        if (url) {
            _defaultURL = url;
        }

        if (_defaultURL.includes('localhost')) {
            console.warn(`Running WebService in Development Mode. Nobody can see these pages but the host computer.`);
        }

        if (!_webview) {
            _webview = new alt.WebView(_defaultURL, false);

            _webview.on('view:Ready', () => {
                _isReady = true;
            });

            _webview.on('play:Sound', (audioName: string, ref: string) => {
                native.playSoundFrontend(-1, audioName, ref, true);
            });

            _webview.on('load', () => {
                alt.log(`WebView has mounted successfully.`);
            });
        }
    },

    /**
     * Get the current WebView instance.
     */
    async get(): Promise<alt.WebView> {
        return new Promise((resolve: Function) => {
            let attempts = 0;

            const interval = alt.setInterval(() => {
                if (attempts >= 255) {
                    alt.clearInterval(interval);
                    return resolve(undefined);
                }

                if (!_webview) {
                    attempts += 1;
                    return;
                }

                if (!_isReady) {
                    attempts += 1;
                    return;
                }

                alt.clearInterval(interval);
                return resolve(_webview);
            }, 100);
        });
    },

    /**
     * Destroy the WebView
     */
    dispose() {
        _webview && _webview.valid && _webview.destroy();
    },

    /**
     * Focus the WebView Instance
     */
    async focus() {
        const view = await WebViewController.get();
        view.focus();
    },

    /**
     * Focus the WebView Instance
     */
    async unfocus() {
        const view = await WebViewController.get();
        view.unfocus();
    },

    /**
     * Show or hide the cursor.
     */
    async showCursor(state: boolean) {
        if (state) {
            _cursorCount += 1;
            try {
                alt.showCursor(true);
            } catch (err) {}
        } else {
            for (let i = 0; i < _cursorCount; i++) {
                try {
                    alt.showCursor(false);
                } catch (err) {}
            }

            _cursorCount = 0;
        }
    },
};

alt.on('disconnect', WebViewController.dispose);
