import { Component, Fragment, createRef, type ReactNode, type RefObject } from 'react';
import { reportBoundaryError } from './errors';

export type BoundaryScope = 'forja' | 'criador' | 'ficha';

/** Replaces React's default caught-error logger, which prints the message and component stack. */
export function onCaughtError(): void {}

const fallbackCopy: Record<BoundaryScope, string> = {
  forja: 'Não foi possível mostrar a forja.',
  criador: 'Não foi possível mostrar o criador.',
  ficha: 'Não foi possível mostrar a ficha.',
};

type Props = { scope: BoundaryScope; children: ReactNode; onReset?: () => void };
type State = { failed: boolean; nonce: number };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, nonce: 0 };
  private alertRef: RefObject<HTMLDivElement | null> = createRef();

  static getDerivedStateFromError(): Pick<State, 'failed'> {
    return { failed: true };
  }

  componentDidCatch(error: unknown): void {
    reportBoundaryError(error, this.props.scope);
  }

  componentDidMount(): void {
    if (this.state.failed) this.alertRef.current?.focus();
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (!prevState.failed && this.state.failed) this.alertRef.current?.focus();
  }

  private retry = () => this.setState(state => ({ failed: false, nonce: state.nonce + 1 }));

  private reset = () => {
    this.props.onReset?.();
    this.setState(state => ({ failed: false, nonce: state.nonce + 1 }));
  };

  render() {
    if (this.state.failed) return <div role="alert" tabIndex={-1} ref={this.alertRef} className="error" data-boundary={this.props.scope}>
      <strong>{fallbackCopy[this.props.scope]}</strong>
      <p>Esta parte falhou ao desenhar. A falha ficou contida aqui. Nenhum dado foi apagado.</p>
      <div className="actions">
        <button type="button" onClick={this.retry}>Tentar de novo</button>
        <button type="button" onClick={this.reset}>Recomeçar</button>
      </div>
    </div>;
    return <Fragment key={this.state.nonce}>{this.props.children}</Fragment>;
  }
}
