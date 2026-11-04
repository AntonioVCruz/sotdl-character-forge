import React from 'react';
import {createRoot} from 'react-dom/client';
import {ErrorBoundary,onCaughtError} from './ErrorBoundary';
import {OfficialCoreGenerator} from './OfficialCoreGenerator';
import {CreationProcedures} from './CreationProcedures';
import './style.css';

/** Production has no demo/fixture route or fallback. Legacy components remain test-only. */
export function Root(){const [procedures,setProcedures]=React.useState(false);return <ErrorBoundary scope="forja"><nav aria-label="Criação"><button onClick={()=>setProcedures(false)}>Core</button><button onClick={()=>setProcedures(true)}>Procedimentos Core / Only Human</button></nav>{procedures?<CreationProcedures/>:<OfficialCoreGenerator/>}</ErrorBoundary>;}
const mount=document.getElementById('root');
if(mount)createRoot(mount,{onCaughtError}).render(<React.StrictMode><Root/></React.StrictMode>);
