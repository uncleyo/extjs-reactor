import union from 'lodash.union';
import cloneDeepWith from 'lodash.clonedeepwith';
import isEqual from 'lodash.isequal';
import ReactDOM from 'react-dom';
import React from 'react';
import HTMLElementWrapper from './HTMLElementWrapper';

/**
 * Returns true if the prop should be converted to a listener config
 * @param {string} prop 
 */
export function isListener(prop) { 
    return prop.match(/^on[A-Z]/);
}

/**
 * Creates a config object for an Ext JS component.
 * @param {string} type 
 * @param {object} props 
 * @returns {object}
 */
export function createConfig(type, props) {
    const xtype = type.replace(/^ExtReact::/, '').toLowerCase();
    let listeners = {};
    
    if (props.listeners) {
        listeners = props.listeners;
        delete props.listeners;
    }

    const config = { xtype, listeners };

    for (let key in props) {
        if (props.hasOwnProperty(key)) {
            if (key === 'config') {
                Object.assign(config, value);
            } else if (isListener(key)) {
                const event = key.slice(2).toLowerCase();
                listeners[event] = props[key];
            } else if (key !== 'children') {
                config[key] = props[key];
            }
        }
    }

    return config;
}

/**
 * If el is a HTMLElement, this method wraps it in an Ext.Component.
 * @param {HTMLElement/Ext.Base} el 
 * @param {*} [config] Optional additional config to apply to the Component
 */
export function wrapDOMElement(el, config = {}) {
    if (el instanceof Ext.Base) {
        return el;
    } else if (el instanceof HTMLElementWrapper) {
        const contentEl = document.createElement('div');
        ReactDOM.render(React.createElement(el.type, el.props), contentEl);
        el.setContentEl(contentEl);
        return new Ext.Component({ contentEl, ...config });
    }
}

/**
 * Calls config setters for all react props that have changed
 */
export function applyUpdate(component, props, oldProps) {
    const keys = union(Object.keys(oldProps), Object.keys(props));

    for (let key of keys) {
        const oldValue = oldProps[key], newValue = props[key];
        if (key === 'children' || typeof newValue === 'function') continue;

        if (!isEqual(oldValue, newValue)) {
            const setter = `set${capitalize(key)}`;

            if (component[setter]) {
                const value = cloneProps(newValue);
                component[setter](value);
            }
        }
    }    
}

/**
 * Capitalizes the first letter in the string
 * @param {String} str
 * @return {String}
 */
export function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

/**
 * Cloning props rather than passing them directly on as configs fixes issues where Ext JS mutates configs during
 * component initialization.  One example of this is grid columns get $initParent added when the grid initializes.
 * @param {Object} props
 */
function cloneProps(props) {
    return cloneDeepWith(props, value => {
        if (value instanceof Ext.Base) {
            return value;
        }
    })
}