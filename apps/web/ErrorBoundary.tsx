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

type Props = { scope: BoundaryScope; children: ReactNode; onReset?: () => void | Promise<void> };
type State = { failed: boolean; nonce: number; resetting: boolean; resetFailed: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, nonce: 0, resetting: false, resetFailed: false };
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

  private retry = () => this.setState(state => ({ failed: false, nonce: state.nonce + 1, resetting: false, resetFailed: false }));

  private reset = () => {
    const onReset = this.props.onReset;
    if (!onReset || this.state.resetting) return;
    this.setState({ resetting: true, resetFailed: false });
    void Promise.resolve()
      .then(() => onReset())
      .then(() => {
        this.setState(state => ({ failed: false, nonce: state.nonce + 1, resetting: false, resetFailed: false }));
      })
      .catch(() => {
        this.setState({ resetting: false, resetFailed: true });
      });
  };

  render() {
    if (this.state.failed) return <div role="alert" tabIndex={-1} ref={this.alertRef} className="error" data-boundary={this.props.scope}>
      <strong>{fallbackCopy[this.props.scope]}</strong>
      <p>{this.props.onReset
        ? 'A falha ficou contida aqui. Tentar de novo redesenha sem apagar o personagem. Recomeçar descarta o personagem salvo neste navegador e abre um novo.'
        : 'A falha ficou contida aqui. Nenhum dado foi apagado.'}</p>
      {this.state.resetFailed && <p>Não foi possível descartar o personagem salvo. Nada foi substituído.</p>}
      <div className="actions">
        <button type="button" onClick={this.retry} disabled={this.state.resetting}>Tentar de novo</button>
        {this.props.onReset && <button type="button" onClick={this.reset} disabled={this.state.resetting}>Recomeçar</button>}
      </div>
    </div>;
    return <Fragment key={this.state.nonce}>{this.props.children}</Fragment>;
  }
}
