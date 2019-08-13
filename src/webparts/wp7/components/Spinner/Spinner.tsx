import * as React from 'react';
import { Spinner as OfficeSpinner } from 'office-ui-fabric-react/lib/Spinner';
import styles from './Spinner.module.scss';


const Spindr: React.FC = () =>
    <div className={styles.Spinner}>
            <OfficeSpinner size={3} className={styles.OfficeSpinner}/>
    </div>;

export default Spindr;