import ReactDOM from 'react-dom';
import ExtReactProvider from './ExtReactProvider';

/**
 * Launches an ExtReact application, creating a viewport and rendering the specified root component into it.
 * @param {React.Component} rootComponent You application's root component
 */
function launch(rootComponent) {
    Ext.application({
        launch: () => ReactDOM.render(rootComponent, Ext.Viewport.getRenderTarget().dom)
    })
}

module.exports = {
    launch, 
    ExtReactProvider
};
