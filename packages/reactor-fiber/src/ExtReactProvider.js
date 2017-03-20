'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactDOMFrameScheduling from 'react-dom/lib/ReactDOMFrameScheduling';
import invariant from 'fbjs/lib/invariant';
import emptyObject from 'fbjs/lib/emptyObject';
import { isListener, createConfig, wrapDOMElement, applyUpdate, capitalize } from './util';
import HTMLElementWrapper from './HTMLElementWrapper';

const UPDATE_SIGNAL = {};
let debug = false;

/**
 * Container that uses custom rendering for Ext JS within React using fiber.
 * Example usage:
 * 
 *  const Panel = 'ExtReact::Panel';
 *  const Button = 'ExtReact::Button';
 * 
 *  function App() {
 *      return (
 *          <ExtReactProvider>
 *              <Panel title="My Panel">
 *                  <Button text="Click Me"/>
 *              </Panel>
 *          </ExtReactProvider>
 *      )    
 *  }
 */
export default class ExtReactProvider extends Component {
    
    /**
     * Toggles debugging information
     * @param {Boolean} on Set to true to see debug output in the browser console.
     */
    static setDebug(on) {
        debug = on;
    }

    validateProps() {
        const { children } = this.props;

        if (children) {
            invariant(!Array.isArray(children), 'ExtReactProvider must contain a single ExtReact component');
            invariant(children.type.match(/^ExtReact::/), 'Child of ExtReactProvider should be an ExtReactProvider component')
        }
    }

    componentDidMount() {
        this.validateProps();
        this._mountNode = ExtJSRenderer.createContainer(this._el);
        ExtJSRenderer.updateContainer(this.props.children, this._mountNode, this);
    }

    componentDidUpdate(prevProps, prevState) {
        this.validateProps();
        ExtJSRenderer.updateContainer(this.props.children, this._mountNode, this);
    }

    componentWillUnmount() {
        ExtJSRenderer.updateContainer(null, this._mountNode, this);
    }

    render() {
        return <div ref={el => this._el = el} data-extjs-root/>
    }

}

/**
 * Implementation of both appendChild and appendInitialChild for ReactFiberReconciler
 * @param {Ext.Base/HTMLElement} parent 
 * @param {Ext.Base/HTMLElementWrapper} child 
 */
function appendChild(parent, child) {
    if (parent instanceof Ext.Base) {
        if (child instanceof Ext.Base && child.initialConfig.rel) {
            // appending an Ext.Component to an Ext.Container
            const name = `set${capitalize(child.initialConfig.rel)}`;
            const setter = parent[name];
            if (setter) {
                if (debug) console.log(`Calling ${name} on`, parent);
                setter.call(parent, child);
            }
        } else if (parent instanceof Ext.Container) {
            // adding an HTML element to an Ext.Container
            if (debug) console.log('Adding item to Ext.Container', child);
            parent.add(wrapDOMElement(child));
        }
    } else if (child instanceof Ext.Base) {
        // Rendering the root Ext JS component to the target div from the render method.
        if (debug) console.log('rendering root Ext.Component', child);
        child.setRenderTo(parent);
    }
}

const ExtJSRenderer = ReactFiberReconciler({

    createInstance(type, props, internalInstanceHandle) {
        if (type.startsWith('ExtReact::')) {
            // Ext JS Components
            return Ext.create(createConfig(type, props));
        } else {
            // HTML elements
            return new HTMLElementWrapper(type, props);
        }
    },

    appendChild,

    appendInitialChild: appendChild,

    commitTextUpdate(textInstance, oldText, newText) {
        // Noop
    },

    commitMount(instance, type, newProps) {
        if (debug) console.log('commitMount', arguments);
        // Noop
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
        if (instance instanceof HTMLElementWrapper) {
            // commitUpdate is called for the changed node and each of its ancestors
            // The following ensures that we only call ReactDOM.render on the root HTML node to optimize performance.
            const contentEl = instance.getContentEl();

            if (contentEl) {
                if (debug) console.log('ReactDOM.render', instance);
                ReactDOM.render(React.createElement(type, newProps), contentEl);
            }
        } else if (instance instanceof Ext.Base) {
            applyUpdate(instance, newProps, oldProps);
        }
    },

    createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
        return text;
    },

    finalizeInitialChildren(domElement, type, props) {
        return false;
    },

    getPublicInstance(instance) {
        return instance;
    },

    insertBefore(parent, child, beforeChild) {
        if (debug) console.log('insertBefore', arguments);
        if (beforeChild instanceof HTMLElementWrapper) beforeChild = Ext.Component.fromElement(beforeChild.getContentEl())
        if (child instanceof HTMLElement) child = wrapDOMElement(child);
        parent.insertBefore(child, beforeChild);
    },

    prepareForCommit() {
        // Noop
    },

    prepareUpdate(domElement, type, oldProps, newProps) {
        if (domElement instanceof HTMLElement && !domElement.parentNode) {
            // don't update orphaned dom elements
            return false;
        } else {
            return UPDATE_SIGNAL;
        }
    },

    removeChild(parent, child) {
        if (parent instanceof Ext.Container) {
            if (debug) console.log('removing child from Ext.Container', parent);
            if (child instanceof HTMLElementWrapper) child = Ext.Component.fromElement(child.getContentEl());
            child.destroy();
        }
    },

    resetAfterCommit() {
        // Noop
    },

    resetTextContent(domElement) {
        // Noop
    },

    shouldDeprioritizeSubtree(type, props) {
        return false;
    },

    getRootHostContext() {
        return emptyObject;
    },

    getChildHostContext() {
        return emptyObject;
    },

    scheduleAnimationCallback: ReactDOMFrameScheduling.rAF,

    scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,

    shouldSetTextContent(props) {
        return typeof props.children === 'string' || typeof props.children === 'number';
    },

    useSyncScheduling: true
});
