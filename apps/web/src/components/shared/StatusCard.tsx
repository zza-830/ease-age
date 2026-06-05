import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatusCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatusCardProps) {
  return (
    <div className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-2 text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="rounded-lg bg-orange-50 p-3">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
