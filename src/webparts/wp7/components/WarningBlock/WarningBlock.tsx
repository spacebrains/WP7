import * as React from 'react';
import styles from './WarningBlock.module.scss';

interface IWarningBlockProps{
  massege:string;
}

const WarningBlock: React.FC<IWarningBlockProps> = ({massege}:IWarningBlockProps) =>
  (<div className={styles.WarningBlock}>
    <h1>{massege}</h1>
  </div>
  );


export default WarningBlock;

