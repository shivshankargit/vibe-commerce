import React from 'react';
import clsx from 'classnames';


export default function Skeleton({ className }) {
    return (
        <div className={clsx('animate-pulse rounded-md bg-gray-200/70', className)} />
    );
}