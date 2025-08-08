import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

interface SummaryCardProps {
  icon?: React.ReactNode;
  title: string;
  value: React.ReactNode;
  color?: string; // e.g. 'emerald', 'red', 'blue', etc.
  subtitle?: string;
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, color = 'emerald', subtitle, className }) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-500',
    red: 'bg-red-100 dark:bg-red-900 text-red-500',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-500',
    orange: 'bg-orange-100 dark:bg-orange-900 text-orange-500',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-500',
    pink: 'bg-pink-100 dark:bg-pink-900 text-pink-500',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-500',
    gray: 'bg-muted text-muted-foreground',
  };
  const badgeColor = colorMap[color] || colorMap.emerald;

  return (
    <div className={cn('rounded-2xl bg-card border border-border shadow-sm p-6 flex items-center gap-4', className)}>
      <div className={cn('rounded-xl p-3 text-xl flex items-center justify-center', badgeColor)}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </div>
    </div>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
