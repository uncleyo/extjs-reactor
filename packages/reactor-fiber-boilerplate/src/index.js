import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { launch } from '@extjs/reactor-fiber';

Ext.require('Ext.*');

launch(<App/>);
