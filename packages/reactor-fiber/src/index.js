import ReactDOM from 'react-dom';
import ExtReactProvider from './ExtReactProvider';

let settings;

/**
 * Launches an ExtReact application, creating a viewport and rendering the specified root component into it.
 * @param {React.Component} rootComponent You application's root component
 * @param {Object} [appConfig] Additional config parameters for Ext.application
 */
export function launch(rootComponent, appConfig = { }, reactorSettings = { debug: false }) {
    settings = reactorSettings;

    Ext.application({
        name: '$ExtReactApp',
        ...appConfig,
        launch: () => ReactDOM.render(rootComponent, Ext.Viewport.getRenderTarget().dom)
    });
} 

module.exports = {
    launch, 
    ExtReactProvider
};
