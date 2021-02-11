import React from 'react';
import styles from './Toggleicon.module.scss';

export default function Toggleicon({collapsed = false}) {
  return(
    <div className={styles.Toggleicon} aria-expanded={collapsed} data-testid="icon-toggle"></div>
  );
};
