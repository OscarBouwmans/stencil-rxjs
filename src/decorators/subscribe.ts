import { ComponentInterface } from '@stencil/core';
import { from, ObservableInput, Subject, Subscription } from 'rxjs';

export function Subscribe<T>(source: ObservableInput<T>) {
    const source$ = from(source);
    const sourceAsSubject = source as Subject<T>;
    let subscription: Subscription;

    let value: T | undefined;
    let error: any | undefined;
    let emissions: number;
    let completed: boolean;

    const reset = () => {
        value = undefined;
        error = undefined;
        emissions = 0;
        completed = false;
    };
  
    return function(target: ComponentInterface, propertyKey: string) {
        const { connectedCallback } = target;
        target.connectedCallback = function() {
            reset();

            subscription?.unsubscribe();
            subscription = source$.subscribe({
                next: (newValue) => {
                    value = newValue;
                    emissions += 1;
                },
                error: (err) => {
                    error = err;
                },
                complete: () => {
                    completed = true;
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
  
        Object.defineProperty(target, propertyKey, {
            get() {
                return value;
            },
            set(nextValue: T) {
                if (typeof sourceAsSubject?.next !== 'function') {
                    throw new TypeError(`Unexpected type '${typeof sourceAsSubject?.next}', expected 'function'. Unable to set the value of property '${propertyKey}'. Perhaps it is not a Subject?`);
                }
                sourceAsSubject.next(nextValue);
            }
        }); 
    }
  }
