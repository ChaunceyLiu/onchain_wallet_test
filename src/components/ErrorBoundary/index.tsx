import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode | ((props: { error: Error | null; data: any; retry: () => void }) => React.ReactNode);
  cachedData?: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // 这里可以添加错误上报逻辑
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const {
      children,
      fallback,
      cachedData,
    } =
      this.props;

    if (hasError) {
      return (
        <>
          {typeof fallback === "function"
            ? fallback({
                error,
                data: cachedData,
                retry: this.handleRetry,
              })
            : React.isValidElement(fallback) ? React.cloneElement(fallback as React.ReactElement<any>, {
                error,
                data: cachedData,
                onRetry: this.handleRetry,
              }) : null}
        </>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
