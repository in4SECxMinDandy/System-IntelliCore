'use client';

import { 
  Pending, Mood, Warning, CheckCircle, 
  TrendingUp, TrendingDown, VerifiedUser, Psychology 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  iconColor?: string;
}

function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'bg-primary-500/10 text-primary-500' }: StatCardProps) {
  return (
    <div className="p-5 rounded-xl bg-stitch-card border border-stitch-border shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-stitch-muted">{title}</p>
        <span className={cn('p-1 rounded', iconColor)}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {change && (
        <p className={cn(
          'text-xs font-medium mt-1 flex items-center gap-1',
          changeType === 'up' ? 'text-green-500' : 
          changeType === 'down' ? 'text-red-500' : 'text-stitch-muted'
        )}>
          {changeType === 'up' && <TrendingUp className="w-3 h-3" />}
          {changeType === 'down' && <TrendingDown className="w-3 h-3" />}
          {change}
        </p>
      )}
    </div>
  );
}

interface FlagReason {
  reason: string;
  percentage: number;
  icon: React.ElementType;
}

interface ModerationStatsProps {
  stats: {
    pendingReviews: number;
    pendingChange?: string;
    avgSentiment: number;
    sentimentChange?: string;
    flaggedFake: number;
    fakeChange?: string;
    autoApproved: number;
    approvedChange?: string;
  };
  flagReasons?: FlagReason[];
}

export default function ModerationStats({ stats, flagReasons = [] }: ModerationStatsProps) {
  const defaultReasons: FlagReason[] = [
    { reason: 'AI Generated', percentage: 45, icon: Psychology },
    { reason: 'Profanity', percentage: 32, icon: Warning },
    { reason: 'Spam Links', percentage: 18, icon: Warning },
  ];

  const reasons = flagReasons.length > 0 ? flagReasons : defaultReasons;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        <StatCard 
          title="Pending Reviews"
          value={stats.pendingReviews}
          change={stats.pendingChange || '+5% from yesterday'}
          changeType="up"
          icon={Pending}
          iconColor="bg-primary-500/10 text-primary-500"
        />
        <StatCard 
          title="Avg Sentiment"
          value={`${stats.avgSentiment}%`}
          change={stats.sentimentChange || '+2% this week'}
          changeType="up"
          icon={Mood}
          iconColor="bg-primary-500/10 text-primary-500"
        />
        <StatCard 
          title="Flagged Fake"
          value={`${stats.flaggedFake}%`}
          change={stats.fakeChange || '-1% detection rate'}
          changeType="down"
          icon={Warning}
          iconColor="bg-red-500/10 text-red-500"
        />
        <StatCard 
          title="Auto-Approved"
          value={stats.autoApproved}
          change={stats.approvedChange || '+12% volume'}
          changeType="up"
          icon={CheckCircle}
          iconColor="bg-green-500/10 text-green-500"
        />
      </div>

      {/* Flag Reasons */}
      <div className="w-full lg:w-80 p-6 rounded-xl bg-stitch-card border border-stitch-border shadow-sm">
        <h3 className="text-lg font-bold text-white mb-4">Top Flag Reasons</h3>
        <div className="space-y-4">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-stitch-muted" />
                    <span className="text-sm font-medium text-stitch-muted">{item.reason}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.percentage}%</span>
                </div>
                <div className="w-full bg-stitch-bg rounded-full h-1.5">
                  <div 
                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
