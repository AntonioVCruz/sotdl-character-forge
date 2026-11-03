import React from 'react';
import {createRoot} from 'react-dom/client';
import {ErrorBoundary,onCaughtError} from './ErrorBoundary';
import {OfficialCoreGenerator} from './OfficialCoreGenerator';
import './style.css';

/** Production has no demo/fixture route or fallback. Legacy components remain test-only. */
export function Root(){return <ErrorBoundary scope="forja"><OfficialCoreGenerator/></ErrorBoundary>;}
const mount=document.getElementById('root');
if(mount)createRoot(mount,{onCaughtError}).render(<React.StrictMode><Root/></React.StrictMode>);
