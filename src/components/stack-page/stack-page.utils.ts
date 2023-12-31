interface IStack<T> {
    push: (item: T) => void;
    pop: () => void;
    clear: () => void;
    getSize: () => number;
    getElements: () => T[]
}

export class Stack<T> implements IStack<T> {
    private container: T[] = [];

    get peek(): T {
        return this.container[this.container.length - 1];
    };

    push = (item: T): void => {
        this.container.push(item);
    };

    pop = (): void => {
        this.container.pop();
    };

    clear = (): void => {
        this.container = [];
    };

    getSize = () => this.container.length;

    getElements = () => this.container;
}
