import { ComponentInterface } from '@stencil/core';
import { from, ObservableInput, Subscription } from 'rxjs';

export const Subscribe = function<T>(source: ObservableInput<T>) {
    const source$ = from(source);
    let subscription: Subscription;
  
    return function(target: ComponentInterface, propertyKey: string) {
        const reset = () => {
            target[propertyKey] = undefined;
        };

        const { connectedCallback } = target;
        target.connectedCallback = function() {
            reset();

            subscription?.unsubscribe();
            subscription = source$.subscribe({
                next: (newValue) => {
                    target[propertyKey] = newValue;
                }
            });

            return connectedCallback?.call?.(this);
        }

        const { disconnectedCallback } = target;
        target.disconnectedCallback = function() {
            reset();

            subscription?.unsubscribe();

            return disconnectedCallback?.call?.(this);
        }
    }
  }
