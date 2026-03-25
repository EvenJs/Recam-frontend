import { Component, type ReactNode } from "react";
import ErrorState from "./ErrorState";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "Something went wrong" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message={this.state.message}
          onRetry={() => this.setState({ hasError: false, message: "" })}
        />
      );
    }
    return this.props.children;
  }
}
