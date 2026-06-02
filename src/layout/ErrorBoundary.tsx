import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { errorFallback, errorFallbackTitle } from "../theme/styles.css.ts";

interface ErrorBoundaryProps {
    /** Human-readable name of the wrapped area, used in the fallback message. */
    readonly section: string;
    readonly children: ReactNode;
}

interface ErrorBoundaryState {
    readonly hasError: boolean;
}

/**
 * Catches render-time errors from its subtree so one broken view cannot blank
 * the whole page. Each top-level section is wrapped in its own boundary, so a
 * throw is contained to that section while every other section stays reachable.
 */
export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // Surface the failure rather than swallowing it: the boundary contains
        // the blast radius, but the underlying error still needs diagnosing.
        console.error(
            `ErrorBoundary caught an error in section "${this.props.section}"`,
            error,
            info.componentStack
        );
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className={errorFallback} role="alert">
                    <p className={errorFallbackTitle}>
                        This section could not be displayed
                    </p>
                    <p style={{ margin: 0 }}>
                        Something went wrong while rendering “
                        {this.props.section}”. The rest of the page is still
                        available — scroll on to keep reading, or reload to try
                        again.
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}
