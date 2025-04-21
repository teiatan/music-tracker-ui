import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

type InputVariant = 'primary' | 'secondary';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: InputVariant;
  customSize?: InputSize;
  title?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  variant = 'primary',
  customSize = 'md',
  title,
  ...rest
}) => {
  const classes = clsx(styles.input, styles[variant], styles[customSize], className);

  return (
    <div className={styles.inputWrapper}>
      {title && <label className={styles.title}>{title}</label>}
      <input className={classes} {...rest} />
    </div>
  );
};

export default Input;
