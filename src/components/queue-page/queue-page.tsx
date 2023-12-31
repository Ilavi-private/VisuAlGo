import React, {ChangeEvent, useState} from "react";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {Input} from "../ui/input/input";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import queuePageStyles from './queue-page.module.css'
import {Queue} from "./queue-page.utils";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {setDelay} from "../../utils/utils";
import {ButtonState} from "../../types/buttonState";

type TQueueItem = {
    value?: string;
    color: ElementStates;
    head?: string;
};

const emptyQueue = Array.from({length: 7}, () => ({value: '', color: ElementStates.Default}));

export const QueuePage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [queueArr, setQueueArr] = useState<TQueueItem[]>(emptyQueue);
    const [disableButtons, setDisableButtons] = useState(false);

    const [loader, setLoader] = useState<ButtonState>({
        buttonAdd: false,
        buttonDelete: false,
        buttonReset: false
    });
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const [queue, setQueue] = useState(new Queue<TQueueItem>(7));

    const handeAddButton = async () => {
        if (inputValue) {
            setLoader({ ...loader, buttonAdd: true });
            setInputValue('');
            queue.enqueue({value: inputValue, color: ElementStates.Default});
            setQueue(queue);
            queueArr[queue.getTail() - 1] = {value: '', color: ElementStates.Changing};
            setQueueArr([...queueArr]);
            await setDelay(SHORT_DELAY_IN_MS);
            queueArr[queue.getTail() - 1] = {value: inputValue, color: ElementStates.Changing};
            setQueueArr([...queueArr]);
            queueArr[queue.getTail() - 1] = {value: inputValue, color: ElementStates.Default};
            setQueueArr([...queueArr]);
            setLoader({ ...loader, buttonAdd: false });
        }
    };

    const handeDeleteButton = async () => {
        setLoader({ ...loader, buttonDelete: true });
        setDisableButtons(true);
        queue.dequeue();
        setQueue(queue);
        queueArr[queue.getHead() - 1] = {value: queueArr[queue.getHead() - 1].value, color: ElementStates.Changing};
        setQueueArr([...queueArr]);
        await setDelay(SHORT_DELAY_IN_MS);
        queueArr[queue.getHead() - 1] = {value: '', color: ElementStates.Default};
        setQueueArr([...queueArr]);
        if (queue.getHead() === 7 && queue.getTail() === 7 && queue.isEmpty()) {
            queueArr[queue.getHead() - 1] = {value: '', color: ElementStates.Default, head: 'head'};
            setQueueArr([...queueArr]);
        }
        setDisableButtons(false);
        setLoader({ ...loader, buttonDelete: false });
    };

    const handleRemoveButton = () => {
        setLoader({ ...loader, buttonReset: true })
        queue.clear()
        setQueue(queue);
        setQueueArr(Array.from({length: 7}, () => ({value: '', color: ElementStates.Default})));
        setLoader({ ...loader, buttonReset: false })
    };

    return (
        <SolutionLayout title="Очередь">
            <div className={queuePageStyles.mainContainer}>
                <div className={queuePageStyles.inputContainer}>
                    <section className={queuePageStyles.inputSection}>
                        <div className={queuePageStyles.input}>
                            <Input maxLength={4} isLimitText={true} type="text" onChange={onChange} value={inputValue}/>
                        </div>
                        <div className={queuePageStyles.addButton}>
                            <Button text="Добавить" data-testid='addBtn' disabled={inputValue === '' || disableButtons}  isLoader={loader.buttonAdd}
                                    onClick={handeAddButton}/>
                        </div>
                        <div className={queuePageStyles.deleteButton}>
                            <Button text="Удалить" data-testid='deleteBtn' disabled={queue.isEmpty() || disableButtons} isLoader={loader.buttonDelete}
                                    onClick={handeDeleteButton}/>
                        </div>
                    </section>
                    <div className={queuePageStyles.button}>
                        <Button text="Очистить" data-testid='removeBtn'
                                disabled={(!queue.getHead() && !queue.getTail()) || disableButtons}  isLoader={loader.buttonReset}
                                onClick={handleRemoveButton}/>
                    </div>
                </div>
                <ul className={queuePageStyles.circlesBox}>
                    {queueArr && queueArr.slice(0, 7).map((item, index) =>
                        <li key={index}>
                            <Circle
                                letter={item.value}
                                index={index}
                                state={item.color}
                                head={(index === queue.getHead() && !queue.isEmpty()) || item.head ? 'head' : ''}
                                tail={(index === queue.getTail() - 1 && !queue.isEmpty()) ? 'tail' : ''}/>
                        </li>)}
                </ul>
            </div>
        </SolutionLayout>
    );
};
