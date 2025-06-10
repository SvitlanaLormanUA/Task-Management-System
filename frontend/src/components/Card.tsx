import classNames from "classnames";

export const Card = ({className, children}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={classNames("shadow bg-white", className)}>
        {children}
    </div>
);

export const CardContent = ({className, children}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={classNames("p-4", className)}>
        {children}
    </div>
);
