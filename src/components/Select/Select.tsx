import React from 'react';
import clsx from 'clsx';
import styles from './Select.module.scss';

type SelectVariant = 'primary' | 'secondary';
type SelectSize = 'sm' | 'md' | 'lg';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  variant?: SelectVariant;
  customSize?: SelectSize;
  title?: string;
}

const Select: React.FC<Props> = ({
  className,
  variant = 'primary',
  customSize = 'md',
  title,
  children,
  ...rest
}) => {
  const classes = clsx(styles.select, styles[variant], styles[customSize], className);

  return (
    <div className={styles.selectWrapper}>
      {title && <label className={styles.title}>{title}</label>}
      <select className={classes} {...rest}>
        {children}
      </select>
    </div>
  );
};

export default Select;
