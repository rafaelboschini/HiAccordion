import React from 'react';
import styles from './Checkbox.module.scss';

export default function Checkbox({status}) {
  //console.log('status', status);
  return (
      <div className={styles.Checkbox} data-status={status} aria-checked={status==='checked' ? "true" : "false"}></div>
  );
};

